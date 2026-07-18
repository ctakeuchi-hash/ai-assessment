import { google } from 'googleapis';
import type { FollowUpContent } from '@/types';

// Brand colors as 0-1 RGB (Docs API's TextStyle.foregroundColor format)
const BRAND_TEAL = { red: 0.051, green: 0.588, blue: 0.533 }; // ~#0d9488
const MUTED = { red: 0.4, green: 0.4, blue: 0.4 };

function getOAuthClient() {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN } = process.env;
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REFRESH_TOKEN) return null;
  const client = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET);
  client.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN });
  return client;
}

interface Run {
  text: string;
  bold?: boolean;
  color?: { red: number; green: number; blue: number };
  size?: number;
}

// Flattens the same sections shown in the branded PDF (FollowUpPDF.tsx) into a
// single text blob + style runs, since the Docs API styles by character range
// rather than by component tree.
function buildRuns(content: FollowUpContent, clientName: string, consultantName: string, date: string) {
  const runs: Run[] = [];
  const bulletRanges: { start: number; end: number }[] = [];
  let offset = 1; // will be bumped to account for the logo image, see createBrandedDoc

  function push(text: string, style: Omit<Run, 'text'> = {}) {
    runs.push({ text, ...style });
    offset += text.length;
  }

  function heading(label: string) {
    push(`${label}\n`, { bold: true, color: BRAND_TEAL, size: 10 });
  }

  function bulletList(items: string[]) {
    const start = offset;
    for (const item of items) push(`${item}\n`);
    bulletRanges.push({ start, end: offset });
  }

  push(`${clientName || 'Client'}\n`, { bold: true, size: 20 });
  push(`Prepared by ${consultantName || 'Consultant'} · ${date}\n\n`, { color: MUTED, size: 9 });

  heading('OUR UNDERSTANDING');
  push(`${content.understanding}\n\n`);

  heading('THE CHALLENGE');
  bulletList(content.challenges.map(c => `${c.title}: ${c.body}`));
  push('\n');

  heading('THE SOLUTION');
  for (const s of content.solutions) {
    push(`${s.headline}\n`, { bold: true });
    if (s.body) push(`${s.body}\n`);
    const chips = [s.pricingTier, s.keyBenefit].filter(Boolean).join('   ·   ');
    if (chips) push(`${chips}\n`, { color: BRAND_TEAL, size: 9 });
    push('\n');
  }

  heading('INVESTMENT & TIMELINE');
  push(`Tier: ${content.tier.label}     Setup: ${content.tier.setup}     Monthly: ${content.tier.monthly}     Go-Live: ${content.goLive}\n\n`);

  heading('NEXT STEP');
  push(`${content.nextStep}\n`);

  return { runs, bulletRanges };
}

async function getOrCreateFolder(drive: ReturnType<typeof google.drive>, name: string, parentId?: string): Promise<string> {
  const escapedName = name.replace(/'/g, "\\'");
  const parentClause = parentId ? ` and '${parentId}' in parents` : '';
  const existing = await drive.files.list({
    q: `name='${escapedName}' and mimeType='application/vnd.google-apps.folder' and trashed=false${parentClause}`,
    fields: 'files(id)',
  });
  if (existing.data.files && existing.data.files.length > 0) return existing.data.files[0].id!;
  const created = await drive.files.create({
    requestBody: { name, mimeType: 'application/vnd.google-apps.folder', parents: parentId ? [parentId] : undefined },
    fields: 'id',
  });
  return created.data.id!;
}

export async function createBrandedDoc(
  content: FollowUpContent,
  clientName: string,
  consultantName: string,
  sessionCreatedAt: string
): Promise<{ id: string; url: string }> {
  const auth = getOAuthClient();
  if (!auth) throw new Error("Google Drive isn't connected — set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REFRESH_TOKEN.");

  const docs = google.docs({ version: 'v1', auth });
  const drive = google.drive({ version: 'v3', auth });

  const created = await docs.documents.create({ requestBody: { title: `${clientName || 'Client'} — DragonScale Proposal` } });
  const documentId = created.data.documentId!;

  // Docs API needs a publicly fetchable image URL — VERCEL_URL points at the
  // per-deployment URL, which sits behind Vercel's deployment protection (SSO
  // wall) and Google can't fetch through that. The custom domain isn't
  // protected, so use it directly; skip the logo when running locally.
  const logoUri = process.env.VERCEL_URL ? 'https://www.dragonscale.consulting/dragonscale-logo.png' : undefined;
  const textStart = logoUri ? 2 : 1;

  const date = new Date(sessionCreatedAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
  const { runs, bulletRanges } = buildRuns(content, clientName, consultantName, date);
  const fullText = runs.map(r => r.text).join('');

  const requests: object[] = [];
  if (logoUri) {
    requests.push({
      insertInlineImage: {
        location: { index: 1 },
        uri: logoUri,
        objectSize: { height: { magnitude: 40, unit: 'PT' }, width: { magnitude: 90, unit: 'PT' } },
      },
    });
  }
  requests.push({ insertText: { location: { index: textStart }, text: fullText } });

  let cursor = textStart;
  for (const run of runs) {
    const start = cursor;
    const end = cursor + run.text.length;
    if (run.bold || run.color || run.size) {
      const textStyle: Record<string, unknown> = {};
      const fields: string[] = [];
      if (run.bold) { textStyle.bold = true; fields.push('bold'); }
      if (run.color) { textStyle.foregroundColor = { color: { rgbColor: run.color } }; fields.push('foregroundColor'); }
      if (run.size) { textStyle.fontSize = { magnitude: run.size, unit: 'PT' }; fields.push('fontSize'); }
      requests.push({ updateTextStyle: { range: { startIndex: start, endIndex: end }, textStyle, fields: fields.join(',') } });
    }
    cursor = end;
  }

  for (const b of bulletRanges) {
    requests.push({
      createParagraphBullets: {
        range: { startIndex: b.start, endIndex: b.end },
        bulletPreset: 'BULLET_DISC_CIRCLE_SQUARE',
      },
    });
  }

  await docs.documents.batchUpdate({ documentId, requestBody: { requests } });

  const rootFolderId = await getOrCreateFolder(drive, 'DragonScale Follow-Ups');
  const folderDate = new Date(sessionCreatedAt).toISOString().slice(0, 10);
  const folderId = await getOrCreateFolder(drive, `${clientName || 'Client'} — ${folderDate}`, rootFolderId);
  const existingParents = await drive.files.get({ fileId: documentId, fields: 'parents' });
  const result = await drive.files.update({
    fileId: documentId,
    addParents: folderId,
    removeParents: (existingParents.data.parents ?? []).join(','),
    fields: 'webViewLink',
  });

  return { id: documentId, url: result.data.webViewLink! };
}
