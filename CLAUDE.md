# ai-assessment

## Development workflow

**Always push changes to the `main` branch.** Do not develop on feature branches unless explicitly asked. After making changes, commit and push directly to `main`.

## Version management

The app version is defined in two places that must stay in sync:
- `const VERSION = "x.x"` near the top of `app/page.jsx`
- `"version"` field in `package.json` (use `x.x.0` format)

Bump the version when shipping meaningful changes.

## Key files

- `app/page.jsx` — entire survey UI (single-file React component)
- `app/api/assess/route.js` — Anthropic API proxy for report generation
- `app/api/save-lead/route.js` — Airtable lead capture
- `app/api/log-error/route.js` — error logging to Airtable + Vercel console
- `app/api/send-email/route.js` — HTML email delivery via Resend

## Environment variables (Vercel)

- `ANTHROPIC_API_KEY` — required for report generation
- `AIRTABLE_PAT` — Airtable personal access token
- `AIRTABLE_BASE_ID` — Airtable base
- `AIRTABLE_TABLE_ID` — leads table
- `AIRTABLE_ERRORS_TABLE_ID` — error logs table (optional)
- `RESEND_API_KEY` — Resend API key for email delivery (get at resend.com)
- `FROM_EMAIL` — verified sender address (e.g. `report@yourdomain.com`; defaults to `onboarding@resend.dev` for testing)
