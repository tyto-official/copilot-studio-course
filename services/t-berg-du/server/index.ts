import cors from 'cors';
import express from 'express';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { generalRateLimit, issueAccess, issueRateLimit, requireAccess } from './access.js';
import { createTbergMcpServer } from './mcp.js';
import { cleanupExpiredSessions, createWorkOrder, getAsset, getAssets, getFaultHistory, getTechnicians, getWorkOrders, resetWorkspace } from './store.js';

const port = Number(process.env.PORT || 8787);
const app = express();
const configuredOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3000,http://127.0.0.1:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.set('trust proxy', 1);
app.use(cors({
  origin: configuredOrigins.includes('*') ? true : configuredOrigins,
  allowedHeaders: ['Content-Type', 'x-workshop-key'],
}));
app.use(express.json({ limit: '1mb' }));
app.use(generalRateLimit);

app.get('/', (_req, res) => {
  res.type('html').send(`<!doctype html>
<html lang="sv">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>T-Berg D&amp;U API</title>
    <style>
      :root { color-scheme: light; font-family: Inter, ui-sans-serif, system-ui, sans-serif; background: #f4f5f2; color: #17211b; }
      body { margin: 0; min-height: 100vh; display: grid; place-items: center; padding: 24px; box-sizing: border-box; }
      main { width: min(680px, 100%); background: white; border: 1px solid #dfe4df; border-radius: 22px; padding: 32px; box-shadow: 0 18px 55px rgba(23,63,49,.10); }
      .mark { display: grid; place-items: center; width: 48px; height: 48px; border-radius: 14px; background: #d6ff54; color: #173f31; font-weight: 900; }
      h1 { margin: 18px 0 6px; font-size: 30px; letter-spacing: -.03em; }
      p { color: #5f6862; line-height: 1.6; }
      .ok { display: inline-flex; align-items: center; gap: 8px; margin-top: 12px; color: #176c49; font-weight: 700; }
      .ok::before { content: ''; width: 9px; height: 9px; border-radius: 999px; background: #2ea66c; }
      ul { margin: 24px 0 0; padding: 0; list-style: none; border-top: 1px solid #e6e9e6; }
      li { display: flex; gap: 14px; padding: 13px 0; border-bottom: 1px solid #e6e9e6; }
      code { color: #173f31; font-weight: 700; }
      span { color: #69716c; }
    </style>
  </head>
  <body>
    <main>
      <div class="mark">T</div>
      <h1>T-Berg D&amp;U API och MCP</h1>
      <p>Tjänsten är igång. Skapa en tidsbegränsad testnyckel i webbgränssnittet och skicka den i <code>x-workshop-key</code>.</p>
      <div class="ok">Tjänsten fungerar</div>
      <ul>
        <li><code>GET /health</code><span>Hälsokontroll</span></li>
        <li><code>POST /access/sessions</code><span>Skapar en tidsbegränsad testmiljö efter Turnstile-verifiering</span></li>
        <li><code>GET /api/assets/:assetId</code><span>Objektuppslag för connectorn</span></li>
        <li><code>POST /mcp</code><span>MCP-endpoint, anropas av en MCP-klient</span></li>
      </ul>
    </main>
  </body>
</html>`);
});

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'T-Berg D&U', version: '0.1.0' }));
app.post('/access/sessions', issueRateLimit, issueAccess);
app.get('/access/session', requireAccess, (_req, res) => res.json(res.locals.accessSession));

app.get('/api/assets', requireAccess, (_req, res) => res.json({ items: getAssets() }));
app.get('/api/assets/:assetId', requireAccess, (req, res) => {
  const assetId = String(req.params.assetId);
  const asset = getAsset(assetId);
  if (!asset) { res.status(404).json({ error: `Objektet ${assetId} finns inte.` }); return; }
  res.json(asset);
});
app.get('/api/assets/:assetId/history', requireAccess, (req, res) => res.json({ items: getFaultHistory(String(req.params.assetId)) }));
app.get('/api/technicians', requireAccess, async (_req, res) => res.json({ items: await getTechnicians(res.locals.accessSession.workspaceId) }));
app.get('/api/work-orders', requireAccess, async (_req, res) => {
  const { workspaceId } = res.locals.accessSession;
  res.json({ workspaceId, items: await getWorkOrders(workspaceId) });
});

app.post('/api/work-orders', requireAccess, async (req, res) => {
  try {
    const { workspaceId, workOrderLimit } = res.locals.accessSession;
    const order = await createWorkOrder({ ...req.body, workspaceId }, workOrderLimit);
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Arbetsordern kunde inte skapas.' });
  }
});

app.post('/api/reset', requireAccess, async (_req, res) => res.json(await resetWorkspace(res.locals.accessSession.workspaceId)));

app.post('/mcp', requireAccess, async (req, res) => {
  const { workspaceId, workOrderLimit } = res.locals.accessSession;
  const server = createTbergMcpServer(workspaceId, workOrderLimit);
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
  res.on('close', () => { void transport.close(); void server.close(); });
  try {
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    if (!res.headersSent) res.status(500).json({ jsonrpc: '2.0', error: { code: -32603, message: error instanceof Error ? error.message : 'Internt serverfel' }, id: null });
  }
});
app.get('/mcp', requireAccess, (_req, res) => res.status(405).json({ error: 'Använd Streamable HTTP POST.' }));
app.delete('/mcp', requireAccess, (_req, res) => res.status(405).json({ error: 'Den lokala servern är stateless.' }));

void cleanupExpiredSessions();
const cleanupTimer = setInterval(() => void cleanupExpiredSessions(), 15 * 60_000);
cleanupTimer.unref();

app.listen(port, () => {
  console.log(`T-Berg D&U API och MCP kör på http://localhost:${port}`);
  console.log('Skapa en tidsbegränsad testnyckel via POST /access/sessions.');
});
