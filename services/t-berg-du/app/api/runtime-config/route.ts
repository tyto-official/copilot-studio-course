export const dynamic = 'force-dynamic';

export function GET() {
  return Response.json({
    apiBase: process.env.API_BASE_URL || 'http://localhost:8787',
    turnstileSiteKey: process.env.TURNSTILE_SITE_KEY || '',
  }, {
    headers: { 'Cache-Control': 'no-store' },
  });
}
