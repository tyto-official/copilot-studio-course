import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

const baseUrl = process.env.API_BASE_URL || 'http://localhost:8787';
type KeyResult = { key: string; workspaceId: string };
type OrdersResult = { items: Array<{ workOrderId: string }> };
type AssetResult = { requiredSkill: string };

async function request<T = unknown>(path: string, headers: Record<string, string> = {}, init: RequestInit = {}, expectedStatus = 200): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, { ...init, headers: { 'Content-Type': 'application/json', ...headers, ...(init.headers || {}) } });
  const body = await response.json();
  if (response.status !== expectedStatus) throw new Error(`${path} gav ${response.status}, väntade ${expectedStatus}: ${JSON.stringify(body)}`);
  return body as T;
}

async function issueKey() {
  return request<KeyResult>('/access/sessions', {}, { method: 'POST', body: JSON.stringify({ turnstileToken: 'tberg-local-turnstile' }) }, 201);
}

async function main() {
  await request('/health');
  await request('/api/assets/VA-12', {}, {}, 401);

  const first = await issueKey();
  const second = await issueKey();
  if (first.workspaceId === second.workspaceId) throw new Error('Testnycklarna fick samma arbetsyta.');
  const firstHeaders = { 'x-workshop-key': first.key };
  const secondHeaders = { 'x-workshop-key': second.key };

  const asset = await request<AssetResult>('/api/assets/VA-12', firstHeaders);
  if (asset.requiredSkill !== 'Ventilation') throw new Error('Fel kompetenskrav för VA-12.');

  const secondBefore = await request<OrdersResult>('/api/work-orders', secondHeaders);
  await request('/api/work-orders', firstHeaders, {
    method: 'POST',
    body: JSON.stringify({ assetId: 'VA-12', title: 'Isoleringstest', description: 'Ska endast synas i den första arbetsytan.', priority: 'P3' }),
  }, 201);
  const firstAfter = await request<OrdersResult>('/api/work-orders', firstHeaders);
  const secondAfter = await request<OrdersResult>('/api/work-orders', secondHeaders);
  if (firstAfter.items.length !== secondBefore.items.length + 1) throw new Error('Arbetsordern skapades inte i den första arbetsytan.');
  if (secondAfter.items.length !== secondBefore.items.length) throw new Error('En arbetsorder läckte till den andra arbetsytan.');

  const client = new Client({ name: 't-berg-local-test', version: '0.1.0' });
  const transport = new StreamableHTTPClientTransport(new URL(`${baseUrl}/mcp`), { requestInit: { headers: firstHeaders } });
  await client.connect(transport);
  const tools = await client.listTools();
  if (tools.tools.length !== 3) throw new Error(`Förväntade 3 MCP-verktyg, fick ${tools.tools.length}.`);
  const history = await client.callTool({ name: 'get_fault_history', arguments: { assetId: 'VA-12', errorCode: 'E37' } });
  if (history.isError) throw new Error('Felhistorikverktyget misslyckades.');
  const created = await client.callTool({
    name: 'create_work_order',
    arguments: { assetId: 'VA-12', title: 'MCP-test', description: 'Skapad efter godkännande.', priority: 'P2', approved: true },
  });
  if (created.isError) throw new Error('MCP kunde inte skapa arbetsordern.');
  await client.close();

  const finalFirst = await request<OrdersResult>('/api/work-orders', firstHeaders);
  const finalSecond = await request<OrdersResult>('/api/work-orders', secondHeaders);
  if (finalFirst.items.length !== secondBefore.items.length + 2) throw new Error('MCP-arbetsordern hamnade inte i nyckelns arbetsyta.');
  if (finalSecond.items.length !== secondBefore.items.length) throw new Error('MCP-arbetsordern läckte mellan arbetsytor.');
  console.log('Nyckel-, isolerings-, REST- och MCP-tester godkända.');
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
