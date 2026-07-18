import { google } from 'googleapis';
import type { FollowUpContent } from '@/types';

// Same dark/teal system as the pitch deck and one-pager PDFs (0-1 RGB, as
// required by the Docs API's Color/OptionalColor types).
const PAGE_BG = { red: 0.0314, green: 0.0353, blue: 0.0588 }; // #08090f
const CARD_BG = { red: 0.0549, green: 0.0627, blue: 0.0941 }; // #0e1018
const TEAL = { red: 0.2196, green: 0.8314, blue: 0.6275 }; // #38d4a0
const TEXT = { red: 0.9098, green: 0.9412, blue: 0.9608 }; // #e8f0f5
const MUTED = { red: 0.5569, green: 0.6275, blue: 0.7059 }; // #8ea0b4
const MONO = 'Courier New';

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
  italic?: boolean;
  color?: { red: number; green: number; blue: number };
  size?: number;
  fontFamily?: string;
}

interface Range { start: number; end: number; }

// Mirrors the pitch deck's 4 slides (components/copilot/PitchDeck.tsx) —
// same headline copy, one Docs "page" per section via insertPageBreak,
// card-style blocks via paragraph shading, since Docs styles by character/
// paragraph range rather than by component tree.
function buildRuns(content: FollowUpContent, clientName: string, consultantName: string, date: string) {
  const runs: Run[] = [];
  const shadeRanges: Range[] = [];
  const pageBreakOffsets: number[] = [];
  let ctaRange: Range | null = null;
  let offset = 1; // bumped to account for the logo image, see createBrandedDoc

  function push(text: string, style: Omit<Run, 'text'> = {}) {
    runs.push({ text, ...style });
    offset += text.length;
  }

  function eyebrow(label: string) {
    push(`${label}\n`, { bold: true, color: TEAL, size: 8, fontFamily: MONO });
  }

  function headline(text: string) {
    push(text, { bold: true, italic: true, size: 26, color: TEXT });
    push('.\n\n', { bold: true, italic: true, size: 26, color: TEAL });
  }

  function card(fn: () => void) {
    const start = offset;
    fn();
    shadeRanges.push({ start, end: offset });
  }

  push(`${clientName || 'Client'}\n`, { bold: true, italic: true, size: 18, color: TEXT });
  push(`Prepared by ${consultantName || 'Consultant'} · ${date}\n\n`, { color: MUTED, size: 9, fontFamily: MONO });

  // 01 — Our Understanding & The Challenge
  eyebrow(`// PREPARED FOR ${(clientName || 'CLIENT').toUpperCase()}`);
  headline('Where things stand');
  push(`${content.understanding}\n\n`, { color: TEXT, size: 10.5 });
  for (const c of content.challenges) {
    card(() => {
      push(`${c.title}\n`, { bold: true, color: TEXT, size: 11 });
      push(`${c.body}\n`, { color: MUTED, size: 9.5 });
    });
    push('\n');
  }
  pageBreakOffsets.push(offset);

  // 02 — Solution Overview
  eyebrow('// THE SOLUTION');
  headline('Our recommendation');
  for (const s of content.solutions) {
    card(() => {
      push(`${s.headline}\n`, { bold: true, color: TEXT, size: 11 });
      if (s.body) push(`${s.body}\n`, { color: MUTED, size: 9.5 });
      const chips = [s.pricingTier, s.keyBenefit].filter(Boolean).join('   ·   ');
      if (chips) push(`${chips}\n`, { color: TEAL, size: 9, fontFamily: MONO });
    });
    push('\n');
  }
  pageBreakOffsets.push(offset);

  // 03 — Investment & Timeline
  eyebrow('// INVESTMENT & TIMELINE');
  headline('Priced to fit');
  card(() => {
    push(`Tier: ${content.tier.label}\n`, { bold: true, color: TEXT, size: 11 });
    push(`Setup: ${content.tier.setup}     Monthly: ${content.tier.monthly}     Go-Live: ${content.goLive}\n`, { color: MUTED, size: 9.5 });
  });
  push('\n');
  pageBreakOffsets.push(offset);

  // 04 — Next Steps
  eyebrow('// NEXT STEPS');
  headline("Let's get started");
  const ctaStart = offset;
  push(`${content.nextStep}\n`, { color: TEXT, size: 10.5 });
  ctaRange = { start: ctaStart, end: offset };
  push('\n');
  push(`DragonScale · ${consultantName || 'Consultant'} · ${date}\n`, { color: MUTED, size: 8, fontFamily: MONO });

  return { runs, shadeRanges, ctaRange, pageBreakOffsets };
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
  const { runs, shadeRanges, ctaRange, pageBreakOffsets } = buildRuns(content, clientName, consultantName, date);
  const fullText = runs.map(r => r.text).join('');

  const requests: object[] = [];

  // Dark page background, matching the deck/one-pager — must come with an
  // explicit light color on every run below, since default Docs text is
  // black and would be invisible against it.
  requests.push({
    updateDocumentStyle: {
      documentStyle: { background: { color: { color: { rgbColor: PAGE_BG } } } },
      fields: 'background',
    },
  });

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
    const textStyle: Record<string, unknown> = {};
    const fields: string[] = [];
    if (run.bold) { textStyle.bold = true; fields.push('bold'); }
    if (run.italic) { textStyle.italic = true; fields.push('italic'); }
    if (run.color) { textStyle.foregroundColor = { color: { rgbColor: run.color } }; fields.push('foregroundColor'); }
    if (run.size) { textStyle.fontSize = { magnitude: run.size, unit: 'PT' }; fields.push('fontSize'); }
    if (run.fontFamily) { textStyle.weightedFontFamily = { fontFamily: run.fontFamily }; fields.push('weightedFontFamily'); }
    if (fields.length > 0) {
      requests.push({ updateTextStyle: { range: { startIndex: start, endIndex: end }, textStyle, fields: fields.join(',') } });
    }
    cursor = end;
  }

  const cardInset = { magnitude: 12, unit: 'PT' };
  const cardSpace = { magnitude: 6, unit: 'PT' };
  for (const r of shadeRanges) {
    requests.push({
      updateParagraphStyle: {
        range: { startIndex: r.start, endIndex: r.end },
        paragraphStyle: {
          shading: { backgroundColor: { color: { rgbColor: CARD_BG } } },
          indentStart: cardInset,
          indentEnd: cardInset,
          spaceAbove: cardSpace,
          spaceBelow: cardSpace,
        },
        fields: 'shading,indentStart,indentEnd,spaceAbove,spaceBelow',
      },
    });
  }

  if (ctaRange) {
    const border = { width: { magnitude: 1, unit: 'PT' }, color: { color: { rgbColor: TEAL } }, dashStyle: 'SOLID', padding: { magnitude: 8, unit: 'PT' } };
    requests.push({
      updateParagraphStyle: {
        range: { startIndex: ctaRange.start, endIndex: ctaRange.end },
        paragraphStyle: {
          shading: { backgroundColor: { color: { rgbColor: CARD_BG } } },
          borderTop: border,
          borderBottom: border,
          borderLeft: border,
          borderRight: border,
          indentStart: cardInset,
          indentEnd: cardInset,
        },
        fields: 'shading,borderTop,borderBottom,borderLeft,borderRight,indentStart,indentEnd',
      },
    });
  }

  // Inserted last, in ascending order — each break shifts every later index
  // by 1, so the i-th break (0-indexed) needs its precomputed offset bumped
  // by i to account for the breaks already inserted before it.
  pageBreakOffsets.forEach((point, i) => {
    requests.push({ insertPageBreak: { location: { index: point + i } } });
  });

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
