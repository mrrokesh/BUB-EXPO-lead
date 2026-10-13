# BUB Expo lead forms - MR Rokesh Softwares

Tablet-friendly lead forms for the MR Rokesh stall (BUB Expo 2026, Salem, Stall #02, 15-17 Oct).

Built with **React, Vite and Tailwind CSS**. A small **Node server** serves the built app and stores leads in **Postgres**.

- Three forms: Business Software, Website & App, Automate My Work.
- English, Tamil, or both (switch at the top).
- Works offline. Every lead is saved on the tablet first, then synced to Postgres when online.
- Per-tablet lead numbers (`K7-012`), gift/offer tracker (one free pen per visitor), staff PIN, idle auto-clear.
- Backups: share to WhatsApp/Drive, download JSON, Excel (CSV) export, combine files from several tablets.
- Installable on the home screen (needs https).

## Project layout

```
src/
  main.jsx, App.jsx          entry and screen switch
  store.jsx                  app state: screen, form in progress, toast, idle timer, background sync
  lang.jsx                   English / Tamil / both
  components/                Home, FormView, Field, Success, TrackerPanel, LeadsPage, LeadDetail, PinGate, ...
  data/forms.js              the three forms: steps, questions, options
  i18n.js                    Tamil text
  config.js                  event details, contact links, timers
  lib/                       plain JavaScript, no React: storage, leads, tracker, sync, backup, idle
public/                      logo and app icons
server.js                    serves dist/ and the sync API
docs/                        the questions as Word and PDF
```

## Run it

```bash
npm install
cp .env.example .env     # then edit .env
npm run build            # builds the app into dist/
npm start                # http://localhost:3000
```

While you work on the app, run `npm run dev` (Vite, with hot reload) in one terminal and `npm start` in another. Vite forwards `/api` to the server on port 3000.

`.env` needs two values:

| Variable | What |
| --- | --- |
| `DATABASE_URL` | Your Postgres connection string. Replace `[YOUR-PASSWORD]` with the real password (URL-encode symbols such as `@ # / :`). |
| `SYNC_KEY` | A long secret of your own (12+ characters). Staff type it into each tablet once. |

Optional: `PORT` (default 3000), `CORS_ORIGIN` (only if the app files are hosted somewhere other than this server), `PGSSL=require` (if your database needs an encrypted connection).

`.env` is git-ignored. Never commit it or paste the password into chat or issues.

## Deploy

Use any host that runs Node, serves https, and lets you set environment variables.

| Setting | Value |
| --- | --- |
| Build command | `npm install --include=dev && npm run build` |
| Start command | `npm start` |
| Environment | `DATABASE_URL`, `SYNC_KEY`, and the host's `PORT` |

The build tools (Vite, Tailwind) are dev dependencies, so the build step must install them.

## Set up each tablet

1. Open the https address in Chrome, then menu > Install app.
2. Leads > Tablet settings (default PIN is 9688, change it).
3. Give the tablet its own **Tablet code** (A, B, C...).
4. Enter the **Sync key**, then tap **Save and test connection**.

## Tests

```bash
npm test      # app logic (Vitest) + server tests against an in-memory Postgres
```

## Notes

- The server creates the `expo_leads` table on first start.
- Deleting a lead on a tablet does not delete the copy in the database.
- The server only serves files from `dist/`. `.env`, `server.js` and `node_modules` are never served.
