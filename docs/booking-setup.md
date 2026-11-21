# Owner booking setup

1. Create a Google Cloud project and enable **Google Calendar API**. Configure the OAuth consent screen as **External**, then publish it to **Production before minting the refresh token**. External apps left in Testing get refresh tokens that expire after seven days. [Google token expiration](https://developers.google.com/identity/protocols/oauth2#expiration).
2. Create a **Web application** OAuth client. Add `https://developers.google.com/oauthplayground` as an authorized redirect URI. In [OAuth Playground](https://developers.google.com/oauthplayground), open the gear, enable **Use your own OAuth credentials**, and enter that client's ID and secret. Use offline access and consent, authorize as the calendar owner with both scopes below, then exchange the authorization code for a refresh token. Keep that token in server secrets only.
   - `https://www.googleapis.com/auth/calendar.freebusy`
   - `https://www.googleapis.com/auth/calendar.events.owned`
3. Create an Upstash Redis database. Copy its REST URL and REST token. Create a Cloudflare Turnstile widget for the production hostnames; copy its site key and secret key. The server verifies both token success and hostname. [Turnstile validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/).
4. Add the following Vercel environment variables to **Production only**. Use the owner's primary calendar, or another calendar they own that supports Google Meet. Booking sends guest invitations using Google Calendar. [Event creation](https://developers.google.com/workspace/calendar/api/v3/reference/events/insert).

| Variable | Value |
| --- | --- |
| `GOOGLE_CLIENT_ID` | Web OAuth client ID; keep server-side |
| `GOOGLE_CLIENT_SECRET` | Web OAuth client secret |
| `GOOGLE_REFRESH_TOKEN` | Owner's refresh token |
| `GOOGLE_CALENDAR_ID` | `primary` (default), or owned calendar ID |
| `UPSTASH_REDIS_REST_URL` | Database REST URL |
| `UPSTASH_REDIS_REST_TOKEN` | Database REST token |
| `TURNSTILE_SECRET_KEY` | Widget secret |
| `BOOKING_ALLOWED_ORIGINS` | Exact origins, comma-separated, e.g. `https://example.com,https://www.example.com`; no paths or trailing slashes |
| `NEXT_PUBLIC_BOOKING_ENABLED` | `1` — public UI toggle |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Widget site key — intentionally public |

5. Redeploy after setting the variables. Run `pnpm build` then `pnpm check:secrets` in a trusted environment with the same server secrets available. The scanner checks public build artifacts, including source maps; it prints variable names and PASS/FAIL only. Never add private credentials to public environment variables, source code, analytics, or logs. Route responses contain no credentials or busy intervals.

For local development, use `BOOKING_MOCK=1 pnpm dev` (PowerShell: `$env:BOOKING_MOCK='1'; pnpm dev`). Mock mode permits `http://localhost:3000`, bypasses Redis and Turnstile, and simulates busy times and new events in process memory. It is always disabled in production. Do not configure production credentials for preview builds or local mock runs.

To revoke access, remove the app from the owner's [Google account connections](https://myaccount.google.com/connections), rotate/delete the OAuth client secret, and remove the refresh token from Vercel. Rotate the Upstash REST token and Turnstile secret in their dashboards if exposed. Remove `NEXT_PUBLIC_BOOKING_ENABLED`, remove the server credentials, and redeploy to disable booking. Public UI flags alone do not disable the API. Existing Calendar events and invitations remain until the owner cancels them.

The Redis lock serializes this app's bookings. It cannot lock edits made directly in Google Calendar; Google has no atomic free/busy-check-and-insert API. If event creation times out, check Calendar before retrying: the event may already exist.
