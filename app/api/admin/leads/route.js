export async function GET(req) {
  const password = req.headers.get('x-admin-password');
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const pat = process.env.AIRTABLE_PAT;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableId = process.env.AIRTABLE_TABLE_ID;

  if (!pat || !baseId || !tableId) {
    return Response.json({ error: 'Airtable not configured' }, { status: 500 });
  }

  try {
    const url = `https://api.airtable.com/v0/${baseId}/${tableId}?sort[0][field]=Submitted%20At&sort[0][direction]=desc`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${pat}` } });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error('Airtable error:', err);
      return Response.json({ error: 'Failed to fetch leads' }, { status: 500 });
    }

    const data = await res.json();
    return Response.json(data);
  } catch (e) {
    console.error('Leads fetch error:', e);
    return Response.json({ error: 'Internal error' }, { status: 500 });
  }
}
