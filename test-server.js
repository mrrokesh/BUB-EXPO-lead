"use strict";
/* Runs the real request handler against an in-memory Postgres (pg-mem). No real database is touched. */
const http = require("http");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { newDb } = require("pg-mem");
const { createHandler, SCHEMA } = require("./server");

function assert(condition, message) {
  if (!condition) throw new Error("FAILED: " + message);
}

(async () => {
  const mem = newDb();
  const { Pool } = mem.adapters.createPg();
  const pool = new Pool();
  for (const statement of SCHEMA.split(";").map((s) => s.trim()).filter(Boolean)) await pool.query(statement);

  // A stand-in for the built app folder (dist/), with a secret file next to it that must never be served.
  const outer = fs.mkdtempSync(path.join(os.tmpdir(), "expo-test-"));
  const dist = path.join(outer, "dist");
  fs.mkdirSync(path.join(dist, "assets"), { recursive: true });
  fs.writeFileSync(path.join(dist, "index.html"), "<!doctype html><title>MR Rokesh</title><div id=root></div>");
  fs.writeFileSync(path.join(dist, "sw.js"), "// service worker");
  fs.writeFileSync(path.join(dist, "assets", "index-abc123.js"), "console.log('app')");
  fs.writeFileSync(path.join(dist, ".env"), "DATABASE_URL=secret");
  fs.writeFileSync(path.join(outer, "server.js"), "// outside the folder");

  const KEY = "test-key-123456789";
  const server = http.createServer(createHandler({ pool, syncKey: KEY, corsOrigin: "", root: dist }));
  await new Promise((resolve) => server.listen(0, resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = (method, url, body, key = KEY) => fetch(base + url, {
    method,
    headers: { "Content-Type": "application/json", ...(key ? { "x-sync-key": key } : {}) },
    body: body ? JSON.stringify(body) : undefined
  });

  const lead = (over = {}) => ({
    id: "a1b2c3", tablet: "K7", no: 1, formId: "software", createdAt: "2026-10-15T09:00:00.000Z", updatedAt: "2026-10-15T09:00:00.000Z",
    mobile: "9876543210", answers: { name: "Asha", mobile: "9876543210", business: "Sri Stores" }, summary: "first", tracker: {}, ...over
  });

  // keys
  assert((await call("GET", "/api/ping", null, "")).status === 401, "no key is refused");
  assert((await call("GET", "/api/ping", null, "wrong")).status === 401, "wrong key is refused");
  const ping = await (await call("GET", "/api/ping")).json();
  assert(ping.ok && ping.leads === 0, "ping with the right key");

  // save
  let res = await (await call("POST", "/api/leads/sync", { leads: [lead(), lead({ id: "b2", tablet: "B", no: 7, formId: "website" })] })).json();
  assert(res.saved === 2 && res.rejected === 0, "two leads saved");
  res = await (await call("POST", "/api/leads/sync", { leads: [{ id: "x" }, null, lead({ id: "bad-form", formId: "nope" }), lead({ id: "bad-date", createdAt: "yesterday" })] })).json();
  assert(res.saved === 0 && res.rejected === 4, "invalid leads are rejected");

  // newer edit wins, older never overwrites
  await call("POST", "/api/leads/sync", { leads: [lead({ updatedAt: "2026-10-15T10:00:00.000Z", summary: "edited", tracker: { pensGiven: 1 } })] });
  await call("POST", "/api/leads/sync", { leads: [lead({ updatedAt: "2026-10-15T08:00:00.000Z", summary: "stale" })] });
  let all = (await (await call("GET", "/api/leads")).json()).leads;
  const a1 = all.find((l) => l.id === "a1b2c3");
  assert(all.length === 2, "no duplicates after repeated sync");
  assert(a1.summary === "edited" && a1.tracker.pensGiven === 1, "newer edit kept, stale copy ignored");
  assert(a1.tablet === "K7" && a1.no === 1 && a1.formId === "software" && a1.answers.business === "Sri Stores" && a1.mobile === "9876543210", "lead shape round-trips");
  assert(typeof a1.createdAt === "string" && a1.createdAt.startsWith("2026-10-15T09:00:00"), "dates round-trip");

  // limits
  const big = Array.from({ length: 201 }, (_, i) => lead({ id: "n" + i }));
  assert((await call("POST", "/api/leads/sync", { leads: big })).status === 413, "batch limit");
  assert((await call("POST", "/api/leads/sync", { nope: 1 })).status === 400, "bad payload shape");

  // the built app is served, nothing else is
  const page = await fetch(base + "/");
  assert(page.status === 200 && (await page.text()).includes("MR Rokesh"), "app page is served");
  assert((await fetch(base + "/index.html")).status === 200, "index.html is served");
  const asset = await fetch(base + "/assets/index-abc123.js");
  assert(asset.status === 200 && asset.headers.get("content-type").startsWith("text/javascript"), "hashed asset is served as JavaScript");
  assert(asset.headers.get("cache-control").includes("immutable"), "hashed assets are cached for a long time");
  assert((await fetch(base + "/sw.js")).headers.get("cache-control") === "no-cache", "service worker is never cached by the browser");
  const route = await fetch(base + "/leads/anything");
  assert(route.status === 200 && (await route.text()).includes("MR Rokesh"), "page routes fall back to index.html");
  assert((await fetch(base + "/missing.js")).status === 404, "missing files are 404, not index.html");
  for (const p of ["/.env", "/%2eenv", "/assets/../.env", "/..%2fserver.js", "/../server.js", "/%2e%2e/server.js", "/assets/%00.js"]) {
    const r = await fetch(base + p);
    assert(r.status === 404 || (await r.text()).includes("MR Rokesh"), p + " must not leak files");
    assert(!(await fetch(base + p).then((x) => x.text())).includes("secret"), p + " must not leak the .env contents");
  }
  assert((await fetch(base + "/api/nope", { headers: { "x-sync-key": KEY } })).status === 404, "unknown API routes are 404");

  // lockout after repeated wrong keys
  let last = 0;
  for (let i = 0; i < 12; i += 1) last = (await call("GET", "/api/ping", null, "guess" + i)).status;
  assert(last === 429, "repeated wrong keys are locked out");
  assert((await call("GET", "/api/ping")).status === 429, "even the right key waits during the lockout");

  server.close();
  fs.rmSync(outer, { recursive: true, force: true });
  console.log("All server tests passed.");
  process.exit(0);
})().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
