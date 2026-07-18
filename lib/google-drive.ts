import { google } from 'googleapis';
import type { SessionDetail, CopilotSuggestion } from '@/types';

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
function buildContent(session: SessionDetail, suggestions: CopilotSuggestion[], clientName: string, consultantName: string) {
  const date = new Date(session.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
  const solutionSuggestions = suggestions.filter(s => s.type === 'solution' || s.type === 'workflow').slice(0, 3);
  const clientNeeds = session.summary_client_needs ?? [];
  const processes = session.current_state_map?.processes ?? [];
  const highPainAreas = processes.filter(p => p.opportunitySize === 'high' || p.painPoints.length > 0);

  const hasGrowth = solutionSuggestions.some(s => s.pricingTier?.toLowerCase().includes('growth'));
  const hasStarter = solutionSuggestions.some(s => s.pricingTier?.toLowerCase().includes('starter'));
  const tier = hasGrowth ? { label: 'Growth', setup: '$4,000–8,000', monthly: '$600/mo' }
    : hasStarter ? { label: 'Starter', setup: '$1,500–3,000', monthly: '$300/mo' }
    : null;

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
  push(`${session.summary_tldr || 'Based on our discovery conversation, we have developed a clear picture of where your business stands today and where automation can create the most leverage.'}\n\n`);

  heading('THE CHALLENGE');
  if (highPainAreas.length > 0) {
    bulletList(highPainAreas.slice(0, 3).map(p => `${p.area}: ${p.currentState}${p.painPoints.length ? ` — ${p.painPoints[0]}` : ''}`));
  } else if (clientNeeds.length > 0) {
    bulletList(clientNeeds.slice(0, 4));
  } else {
    push('Key operational challenges identified during our discovery conversation.\n');
  }
  push('\n');

  heading('THE SOLUTION');
  if (solutionSuggestions.length > 0) {
    for (const s of solutionSuggestions) {
      push(`${s.headline}\n`, { bold: true });
      if (s.proposedSolution) push(`${s.proposedSolution}\n`);
      const chips = [s.pricingTier, s.keyBenefit].filter(Boolean).join('   ·   ');
      if (chips) push(`${chips}\n`, { color: BRAND_TEAL, size: 9 });
      push('\n');
    }
  } else {
    push('Custom Automation Suite\n', { bold: true });
    push("Based on the processes discussed, we would design and implement an automation layer tailored to your team's workflows.\n\n");
  }

  heading('INVESTMENT & TIMELINE');
  if (tier) {
    push(`Tier: ${tier.label}     Setup: ${tier.setup}     Monthly: ${tier.monthly}     Go-Live: 4 weeks\n\n`);
  } else {
    push('Approach: Scoped after this call     Go-Live: 4 weeks from signed agreement\n\n');
  }

  heading('NEXT STEP');
  push("30-minute scoping call to confirm scope and finalize the proposal. I'll send a calendar link — or reply with a time that works.\n");

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
  session: SessionDetail,
  suggestions: CopilotSuggestion[],
  clientName: string,
  consultantName: string
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

  const { runs, bulletRanges } = buildContent(session, suggestions, clientName, consultantName);
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
  const folderDate = new Date(session.created_at).toISOString().slice(0, 10);
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
