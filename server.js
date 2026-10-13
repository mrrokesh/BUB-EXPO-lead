"use strict";
/*
 * MR Rokesh expo lead server.
 * Serves the built app (dist/) and stores leads from every tablet in Postgres.
 *
 *   1. Copy .env.example to .env and fill in DATABASE_URL and SYNC_KEY.
 *   2. npm install
 *   3. npm run build    (builds the app into dist/)
 *   4. npm start        ->  http://localhost:3000
 *
 * The tablets keep working offline and push their leads here whenever they are online.
 * The database address and password stay in .env on this server. They never reach a tablet.
 */
const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

/* Tiny .env loader so no extra package is needed. Real environment variables win. */
function loadEnvFile(file) {
  let text = "";
  try { text = fs.readFileSync(file, "utf8"); } catch (error) { return; }
  text.split(/\r?\n/).forEach((line) => {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!match || line.trim().startsWith("#")) return;
    let value = match[2];
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    if (process.env[match[1]] === undefined) process.env[match[1]] = value;
  });
}

const FORM_IDS = new Set(["software", "website", "automate"]);
const MAX_BODY = 2 * 1024 * 1024;
const MAX_BATCH = 200;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".webmanifest": "application/manifest+json",
  ".webp": "image/webp",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8"
};
const NO_CACHE = new Set(["index.html", "sw.js", "registerSW.js", "manifest.webmanifest"]);

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS expo_leads (
    id          text PRIMARY KEY,
    tablet      text NOT NULL,
    lead_no     integer NOT NULL,
    form_id     text NOT NULL,
    created_at  timestamptz NOT NULL,
    updated_at  timestamptz NOT NULL,
    mobile      text,
    name        text,
    business    text,
    answers     jsonb NOT NULL,
    summary     text,
    tracker     jsonb NOT NULL,
    received_at timestamptz NOT NULL DEFAULT now()
  );
  CREATE INDEX IF NOT EXISTS expo_leads_mobile_idx ON expo_leads (mobile);
  CREATE INDEX IF NOT EXISTS expo_leads_created_idx ON expo_leads (created_at);
`;

const UPSERT = `
  INSERT INTO expo_leads (id, tablet, lead_no, form_id, created_at, updated_at, mobile, name, business, answers, summary, tracker)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
  ON CONFLICT (id) DO UPDATE SET
    tablet = EXCLUDED.tablet, lead_no = EXCLUDED.lead_no, form_id = EXCLUDED.form_id,
    updated_at = EXCLUDED.updated_at, mobile = EXCLUDED.mobile, name = EXCLUDED.name,
    business = EXCLUDED.business, answers = EXCLUDED.answers, summary = EXCLUDED.summary,
    tracker = EXCLUDED.tracker, received_at = now()
  WHERE expo_leads.updated_at < EXCLUDED.updated_at
`;

/* Turns one lead from a tablet into a row, or returns null if it is not a valid lead. */
function toRow(lead) {
  if (!lead || typeof lead !== "object") return null;
  const id = String(lead.id || "");
  if (!id || id.length > 64) return null;
  if (!FORM_IDS.has(lead.formId)) return null;
  const created = new Date(lead.createdAt);
  if (Number.isNaN(created.getTime())) return null;
  const updated = lead.updatedAt && !Number.isNaN(new Date(lead.updatedAt).getTime()) ? new Date(lead.updatedAt) : created;
  const answers = lead.answers && typeof lead.answers === "object" ? lead.answers : {};
  const text = (value, max) => (value == null ? null : String(value).slice(0, max));
  return [
    id,
    text(lead.tablet, 3) || "?",
    Math.max(0, parseInt(lead.no, 10) || 0),
    lead.formId,
    created.toISOString(),
    updated.toISOString(),
    text(lead.mobile || answers.mobile, 20),
    text(answers.name, 120),
    text(answers.business, 160),
    JSON.stringify(answers),
    text(lead.summary, 2000),
    JSON.stringify(lead.tracker && typeof lead.tracker === "object" ? lead.tracker : {})
  ];
}

/* Maps a stored row back to the lead shape the tablets use. */
function fromRow(row) {
  return {
    id: row.id,
    tablet: row.tablet,
    no: row.lead_no,
    formId: row.form_id,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
    mobile: row.mobile || "",
    answers: row.answers,
    summary: row.summary || "",
    tracker: row.tracker || {}
  };
}

function safeEqual(a, b) {
  const x = crypto.createHash("sha256").update(String(a)).digest();
  const y = crypto.createHash("sha256").update(String(b)).digest();
  return crypto.timingSafeEqual(x, y);
}

/* Finds the file to serve from the built app folder, or null. Page routes fall back to index.html.
   Dotfiles (such as .env) and anything outside the folder are never served. */
function resolveStatic(root, pathname) {
  let decoded;
  try { decoded = decodeURIComponent(pathname); } catch (error) { return null; }
  if (decoded.includes("\u0000")) return null;
  const relative = path.normalize(decoded).replace(/^[\\/]+/, "");
  if (relative.split(/[\\/]/).some((part) => part.startsWith(".") && part !== "")) return null;
  const rootDir = path.resolve(root);
  const full = path.resolve(rootDir, relative);
  if (full !== rootDir && !full.startsWith(rootDir + path.sep)) return null;
  try {
    if (fs.statSync(full).isFile()) return full;
  } catch (error) { /* not a file */ }
  if (!path.extname(relative)) {
    const index = path.join(rootDir, "index.html");
    if (fs.existsSync(index)) return index;
  }
  return null;
}

/* pool only needs query(sql, params). That keeps the handler easy to test with a stand-in database. */
function createHandler({ pool, syncKey, corsOrigin, root }) {
  const failures = new Map();

  function send(res, code, body, headers) {
    const isText = typeof body === "string" || Buffer.isBuffer(body);
    res.writeHead(code, {
      "Content-Type": isText ? "text/plain; charset=utf-8" : "application/json",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      ...(corsOrigin ? { "Access-Control-Allow-Origin": corsOrigin, "Vary": "Origin" } : {}),
      ...headers
    });
    res.end(isText ? body : JSON.stringify(body));
  }

  function authorized(req) {
    const ip = req.socket.remoteAddress || "?";
    const bad = failures.get(ip) || { count: 0, until: 0 };
    if (Date.now() < bad.until) return "locked";
    if (safeEqual(req.headers["x-sync-key"] || "", syncKey)) {
      failures.delete(ip);
      return "ok";
    }
    bad.count += 1;
    if (bad.count >= 10) { bad.count = 0; bad.until = Date.now() + 60 * 1000; }
    failures.set(ip, bad);
    return "bad";
  }

  function readBody(req) {
    return new Promise((resolve, reject) => {
      let size = 0;
      const chunks = [];
      req.on("data", (chunk) => {
        size += chunk.length;
        if (size > MAX_BODY) { reject(new Error("too large")); req.destroy(); return; }
        chunks.push(chunk);
      });
      req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
      req.on("error", reject);
    });
  }

  return async function handler(req, res) {
    const url = new URL(req.url, "http://localhost");
    try {
      if (url.pathname.startsWith("/api/")) {
        if (req.method === "OPTIONS") {
          return send(res, 204, "", corsOrigin ? { "Access-Control-Allow-Headers": "content-type, x-sync-key", "Access-Control-Allow-Methods": "GET, POST, OPTIONS" } : {});
        }
        const auth = authorized(req);
        if (auth === "locked") return send(res, 429, { error: "Too many wrong keys. Wait a minute." });
        if (auth !== "ok") return send(res, 401, { error: "Wrong sync key." });

        if (req.method === "GET" && url.pathname === "/api/ping") {
          const result = await pool.query("SELECT count(*)::int AS leads FROM expo_leads");
          return send(res, 200, { ok: true, leads: result.rows[0].leads, serverTime: new Date().toISOString() });
        }
        if (req.method === "GET" && url.pathname === "/api/leads") {
          const result = await pool.query("SELECT * FROM expo_leads ORDER BY created_at ASC");
          return send(res, 200, { leads: result.rows.map(fromRow) });
        }
        if (req.method === "POST" && url.pathname === "/api/leads/sync") {
          let payload;
          try { payload = JSON.parse(await readBody(req)); } catch (error) { return send(res, 400, { error: "Bad request." }); }
          if (!payload || !Array.isArray(payload.leads)) return send(res, 400, { error: "Expected { leads: [...] }." });
          if (payload.leads.length > MAX_BATCH) return send(res, 413, { error: `Send at most ${MAX_BATCH} leads at a time.` });
          let saved = 0;
          let rejected = 0;
          for (const lead of payload.leads) {
            const row = toRow(lead);
            if (!row) { rejected += 1; continue; }
            await pool.query(UPSERT, row);
            saved += 1;
          }
          return send(res, 200, { ok: true, saved, rejected, serverTime: new Date().toISOString() });
        }
        return send(res, 404, { error: "Not found." });
      }

      if (req.method !== "GET") return send(res, 404, "Not found");
      const file = resolveStatic(root, url.pathname);
      if (!file) return send(res, 404, "Not found");
      const name = path.relative(root, file).split(path.sep).join("/");
      const cache = NO_CACHE.has(name) ? "no-cache" : name.startsWith("assets/") ? "public, max-age=31536000, immutable" : "public, max-age=300";
      return send(res, 200, fs.readFileSync(file), { "Content-Type": MIME[path.extname(file)] || "application/octet-stream", "Cache-Control": cache });
    } catch (error) {
      console.error(new Date().toISOString(), req.method, url.pathname, error.message);
      return send(res, 500, { error: "Server error. Check the server log." });
    }
  };
}

async function main() {
  loadEnvFile(path.join(__dirname, ".env"));
  const { DATABASE_URL, SYNC_KEY, PORT = "3000", CORS_ORIGIN = "", PGSSL = "" } = process.env;
  if (!DATABASE_URL || DATABASE_URL.includes("[YOUR-PASSWORD]")) {
    console.error("Open .env and put the real database password in DATABASE_URL (replace [YOUR-PASSWORD]).");
    process.exit(1);
  }
  if (!SYNC_KEY || SYNC_KEY.length < 12 || SYNC_KEY.startsWith("change-me")) {
    console.error("Open .env and set SYNC_KEY to a long secret of your own (at least 12 characters).");
    process.exit(1);
  }
  const root = path.join(__dirname, "dist");
  if (!fs.existsSync(path.join(root, "index.html"))) {
    console.error("The app has not been built yet. Run: npm run build");
    process.exit(1);
  }
  const { Pool } = require("pg");
  const pool = new Pool({ connectionString: DATABASE_URL, max: 5, connectionTimeoutMillis: 10000, ...(PGSSL === "require" ? { ssl: { rejectUnauthorized: false } } : {}) });
  pool.on("error", (error) => console.error("Database connection error:", error.message));
  await pool.query(SCHEMA);
  const server = http.createServer(createHandler({ pool, syncKey: SYNC_KEY, corsOrigin: CORS_ORIGIN, root }));
  server.listen(Number(PORT), () => console.log(`Expo lead server running on port ${PORT}. Database connected.`));
}

if (require.main === module) {
  main().catch((error) => {
    console.error("Could not start:", error.message);
    process.exit(1);
  });
}

module.exports = { createHandler, toRow, fromRow, SCHEMA, UPSERT, loadEnvFile };
