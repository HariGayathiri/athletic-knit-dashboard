// ============================================================================
// ATHLETIC KNIT — VERCEL SERVERLESS API PROXY FOR HUBSPOT
// ============================================================================
// This runs on Vercel's cloud servers (NOT in the browser).
// Proxies all HubSpot API calls server-side to bypass CORS restrictions.
// Token is stored securely in Vercel Environment Variables — never in code.
// ============================================================================

export default async function handler(req, res) {
  // Allow cross-origin requests from HubSpot's iframe domain
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle browser preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Load token from Vercel Environment Variable (set in Vercel dashboard)
  const token = process.env.HUBSPOT_PRIVATE_TOKEN;
  if (!token) {
    return res.status(500).json({ error: 'HUBSPOT_PRIVATE_TOKEN is not set in environment variables.' });
  }

  // Read which HubSpot API path to call
  // Example: /api/hubspot?path=/crm/v3/objects/contacts/123
  const path = req.query.path;
  if (!path) {
    return res.status(400).json({ error: 'Missing required "path" query parameter.' });
  }

  const hubspotUrl = `https://api.hubapi.com${path}`;
  const isPost = req.method === 'POST';

  try {
    const fetchOptions = {
      method: isPost ? 'POST' : 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    // Forward POST body for batch read requests
    if (isPost && req.body) {
      fetchOptions.body = JSON.stringify(req.body);
    }

    const hubspotRes = await fetch(hubspotUrl, fetchOptions);
    const data = await hubspotRes.json();
    return res.status(hubspotRes.status).json(data);
  } catch (err) {
    console.error('HubSpot proxy error:', err);
    return res.status(500).json({ error: 'Failed to reach HubSpot API.', details: err.message });
  }
}
