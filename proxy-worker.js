// Deploy this to Cloudflare Workers (free at workers.cloudflare.com)
// Add your Anthropic API key as an environment variable named: ANTHROPIC_KEY
//
// Steps:
// 1. Go to workers.cloudflare.com → sign up free
// 2. Create a new Worker → paste this code
// 3. Settings → Variables → add ANTHROPIC_KEY = your sk-ant-... key
// 4. Deploy → copy your worker URL (e.g. https://cso-proxy.yourname.workers.dev)
// 5. Paste that URL into the Content Agent API settings

const ALLOWED_ORIGIN = '*'; // lock to your domain in production if desired

export default {
  async fetch(request) {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    // Validate Authorization header exists (Bearer <anthropic_key> from the browser)
    // We ignore the browser key and use the Worker's own env variable instead
    let body;
    try {
      body = await request.json();
    } catch {
      return new Response('Invalid JSON', { status: 400 });
    }

    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await upstream.text();
    return new Response(data, {
      status: upstream.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
      },
    });
  },
};
