import fetch from 'node-fetch';

export async function handler(event) {
  try {
    const token = process.env.HUBSPOT_PRIVATE_TOKEN;
    if (!token) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Missing HUBSPOT_PRIVATE_TOKEN' }) };
    }

    const url = 'https://api.hubapi.com/crm/v3/objects/contacts?limit=10';
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    });
    if (!res.ok) {
      const text = await res.text();
      return { statusCode: res.status, body: text };
    }
    const data = await res.json();
    return { statusCode: 200, body: JSON.stringify(data) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
// ============================================================================
// ATHLETIC KNIT — NETLIFY SERVERLESS PROXY FOR HUBSPOT API
// ============================================================================
// This function runs on Netlify's servers (NOT in the browser).
// It proxies all HubSpot API calls server-side to bypass CORS restrictions.
// The private app token is NEVER exposed to the browser.
// ============================================================================

// Token loaded from Netlify Environment Variable (never hardcoded in source code)
// Set this in: Netlify → Site Configuration → Environment Variables
// Key: HUBSPOT_PRIVATE_TOKEN  Value: pat-na2-xxxx...
const HUBSPOT_API_TOKEN = process.env.HUBSPOT_PRIVATE_TOKEN;
const BASE_URL = 'https://api.hubapi.com';

exports.handler = async (event) => {
  // CORS headers — allow our Netlify app to call this function
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  // Handle preflight OPTIONS request from browser
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  // Read the HubSpot API path from query parameters
  // Example: /.netlify/functions/hubspot?path=/crm/v3/objects/contacts/123
  const path = event.queryStringParameters?.path;
  if (!path) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Missing required "path" query parameter' }),
    };
  }

  const method = event.httpMethod === 'POST' ? 'POST' : 'GET';
  const url = `${BASE_URL}${path}`;

  try {
    const fetchOptions = {
      method,
      headers: {
        'Authorization': `Bearer ${HUBSPOT_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    };

    // Forward POST body (for batch read requests)
    if (method === 'POST' && event.body) {
      fetchOptions.body = event.body;
    }

    const response = await fetch(url, fetchOptions);
    const data = await response.json();

    return {
      statusCode: response.status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('HubSpot Proxy Error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Failed to fetch from HubSpot API', details: error.message }),
    };
  }
};
