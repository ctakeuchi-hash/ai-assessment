// One-time local script to mint a Google OAuth refresh token for the
// "Export to Google Doc" feature. Run once with:
//   GOOGLE_CLIENT_ID=... GOOGLE_CLIENT_SECRET=... node scripts/google-auth-setup.mjs
// Prints a refresh_token — paste it into Vercel as GOOGLE_REFRESH_TOKEN.
import { google } from 'googleapis';
import http from 'http';

const PORT = 3001;
const REDIRECT_URI = `http://localhost:${PORT}/oauth2callback`;
const SCOPES = ['https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/documents'];

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;
if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  console.error('Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET env vars before running this script.');
  process.exit(1);
}

const oAuth2Client = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, REDIRECT_URI);

const authUrl = oAuth2Client.generateAuthUrl({
  access_type: 'offline',
  prompt: 'consent', // forces a refresh_token even if you've authorized this app before
  scope: SCOPES,
});

console.log('\nOpen this URL, sign in with the Google account you want the app to write to, and approve access:\n');
console.log(authUrl);
console.log(`\nWaiting for the redirect back to ${REDIRECT_URI} ...\n`);

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, REDIRECT_URI);
  if (url.pathname !== '/oauth2callback') { res.end(); return; }

  const code = url.searchParams.get('code');
  if (!code) {
    res.end('No authorization code received — check the terminal and try again.');
    server.close();
    return;
  }

  try {
    const { tokens } = await oAuth2Client.getToken(code);
    res.end('Success — you can close this tab and return to the terminal.');
    server.close();
    console.log('GOOGLE_REFRESH_TOKEN=' + tokens.refresh_token);
    console.log('\nAdd that as an environment variable in Vercel, alongside GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.');
  } catch (e) {
    res.end('Token exchange failed — check the terminal.');
    server.close();
    console.error(e);
  }
});

server.listen(PORT);
