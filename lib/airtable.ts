const BASE_ID = 'appOstsMNlKfcV9wo';
const TABLE_ID = 'tblowY9Qaa8KM0Gbi';

export interface CRMRecord {
  company: string;
  contactName?: string;
  contactEmail?: string;
  status: 'Discovery' | 'Proposal Sent' | 'Negotiating' | 'Won' | 'Lost' | 'Nurture';
  tier?: string;
  sentiment?: 'Hot' | 'Warm' | 'Cold';
  summary?: string;
  keyPainPoints?: string;
  nextAction?: string;
  sessionId?: string;
  notes?: string;
}

export async function pushToCRM(record: CRMRecord): Promise<void> {
  const key = process.env.AIRTABLE_API_KEY;
  if (!key) throw new Error('AIRTABLE_API_KEY not configured');

  const fields: Record<string, string> = {
    'Company': record.company,
    'Status': record.status,
    'Last Call': new Date().toISOString().slice(0, 10),
  };
  if (record.contactName) fields['Contact Name'] = record.contactName;
  if (record.contactEmail) fields['Contact Email'] = record.contactEmail;
  if (record.tier) fields['Tier'] = record.tier;
  if (record.sentiment) fields['Sentiment'] = record.sentiment;
  if (record.summary) fields['Summary'] = record.summary;
  if (record.keyPainPoints) fields['Key Pain Points'] = record.keyPainPoints;
  if (record.nextAction) fields['Next Action'] = record.nextAction;
  if (record.sessionId) fields['Session ID'] = record.sessionId;
  if (record.notes) fields['Notes'] = record.notes;

  const res = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Airtable: ${err}`);
  }
}
