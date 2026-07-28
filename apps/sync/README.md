# sync — Google Calendar push

Populates a dedicated **Perfect Pi-Days** calendar with every perfect day in the
lifetime window (`packages/data/generated/perfect-days.json`). Idempotent: every
event carries a stable `iCalUID` derived from `(date, calendar, reckoning)`, so
re-running updates events in place — never duplicates. Events start at the
π-instant **09:26:53** local time with the reading in the title.

## OAuth setup, end to end

The sync runs as an installed-app OAuth client with a long-lived refresh token.
One-time setup:

1. **Create a Google Cloud project** (or reuse one): <https://console.cloud.google.com>.
2. **Enable the Calendar API**: APIs & Services → Library → *Google Calendar API* → Enable.
3. **Configure the OAuth consent screen**: APIs & Services → OAuth consent screen.
   - User type: *External* is fine; add your own Google account as a **test user**
     (the app can stay in "Testing" — only you use it).
   - Scope needed: `https://www.googleapis.com/auth/calendar`.
4. **Create credentials**: APIs & Services → Credentials → Create credentials →
   *OAuth client ID* → Application type **Desktop app**. Note the client ID and secret.
5. **Mint a refresh token** (one-time, in a browser + terminal):

   ```bash
   # 1. Open this URL (fill in YOUR_CLIENT_ID), approve access:
   https://accounts.google.com/o/oauth2/v2/auth?client_id=YOUR_CLIENT_ID&redirect_uri=http://127.0.0.1:8765&response_type=code&scope=https://www.googleapis.com/auth/calendar&access_type=offline&prompt=consent

   # 2. The browser redirects to http://127.0.0.1:8765/?code=CODE... — copy CODE.

   # 3. Exchange the code for tokens:
   curl -s https://oauth2.googleapis.com/token \
     -d client_id=YOUR_CLIENT_ID \
     -d client_secret=YOUR_CLIENT_SECRET \
     -d code=CODE \
     -d grant_type=authorization_code \
     -d redirect_uri=http://127.0.0.1:8765
   # → JSON containing "refresh_token": keep it.
   ```

6. **Export the environment** (store the values in your secret manager, not in files):

   ```bash
   export GOOGLE_CLIENT_ID=...
   export GOOGLE_CLIENT_SECRET=...
   export GOOGLE_REFRESH_TOKEN=...
   export SYNC_TIMEZONE=Europe/Stockholm   # optional, this is the default
   ```

## Run

```bash
pnpm --filter sync sync:dry   # print every event without touching Google
pnpm --filter sync sync       # create/update the calendar + events
```

The first run creates the *Perfect Pi-Days* calendar and one event per perfect
day. Any later run (after regenerating the artifacts, or unchanged) converges to
the same state: existing events are updated by `iCalUID`, nothing is duplicated.

## Verify idempotency

```bash
pnpm --filter sync sync   # → N created, 0 updated
pnpm --filter sync sync   # → 0 created, N updated  ← no duplicates
```

The same guarantee is covered credential-free by `test/sync.test.ts` against an
in-memory Google Calendar fake.
