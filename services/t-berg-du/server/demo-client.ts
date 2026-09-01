import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

const args = process.argv.slice(2);
const option = (name: string) => {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
};
const mode = option('--mode') || 'all';
const baseUrl = process.env.API_BASE_URL || 'http://localhost:8787';
const assetId = option('--asset') || 'LO-VA-012';

async function jsonRequest<T>(path: string, key?: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(key ? { 'x-workshop-key': key } : {}), ...(init.headers || {}) },
  });
  const body = await response.json();
  if (!response.ok) throw new Error(`${response.status}: ${JSON.stringify(body)}`);
  return body as T;
}

async function getKey() {
  const supplied = option('--key') || process.env.TBERG_KEY;
  if (supplied) return supplied;
  const issued = await jsonRequest<{ key: string; workspaceId: string; expiresAt: string }>('/access/sessions', undefined, {
    method: 'POST',
    body: JSON.stringify({ turnstileToken: 'tberg-local-turnstile' }),
  });
  console.log('\nNY TESTMILJÖ');
  console.log(`Arbetsyta: ${issued.workspaceId}`);
  console.log(`Giltig till: ${new Date(issued.expiresAt).toLocaleString('sv-SE')}`);
  console.log(`Nyckel: ${issued.key}\n`);
  return issued.key;
}

async function connectorDemo(key: string) {
  const asset = await jsonRequest<Record<string, unknown>>(`/api/assets/${assetId}`, key);
  console.log('CONNECTOR / REST — GetAsset');
  console.log(JSON.stringify(asset, null, 2));
}

async function mcpDemo(key: string) {
  const client = new Client({ name: 't-berg-terminal-demo', version: '0.2.0' });
  const transport = new StreamableHTTPClientTransport(new URL(`${baseUrl}/mcp`), {
    requestInit: { headers: { 'x-workshop-key': key } },
  });
  await client.connect(transport);
  try {
    const tools = await client.listTools();
    console.log('\nMCP — TILLGÄNGLIGA VERKTYG');
    console.log(tools.tools.map((tool) => `• ${tool.name}: ${tool.description}`).join('\n'));

    const history = await client.callTool({ name: 'get_fault_history', arguments: { assetId, errorCode: 'E37' } });
    console.log('\nMCP — FELHISTORIK');
    console.log(history.content);

    const technicians = await client.callTool({ name: 'find_available_technicians', arguments: { requiredSkill: 'Ventilation' } });
    console.log('\nMCP — TEKNIKER');
    console.log(technicians.content);

    const parts = await client.callTool({ name: 'find_spare_parts', arguments: { assetId, impactLevel: 'Stoppad', sameErrorCodeCount: 0 } });
    console.log('\nMCP — RESERVDELAR');
    console.log(parts.content);

    const created = await client.callTool({
      name: 'create_work_order',
      arguments: {
        assetId,
        title: 'Terminaltest via MCP',
        description: 'Tillfällig arbetsorder som verifierar MCP-skrivning i den privata arbetsytan.',
        priority: 'P2',
        technicianId: 'T-102',
        approved: true,
      },
    });
    console.log('\nMCP — SKAPA ARBETSORDER');
    console.log(created.content);
  } finally {
    await client.close();
  }

  const orders = await jsonRequest<{ workspaceId: string; items: Array<{ workOrderId: string; title: string; status: string }> }>('/api/work-orders', key);
  console.log('\nARBETSYTAN EFTER MCP-ANROPET');
  console.log(`Arbetsyta: ${orders.workspaceId}`);
  console.table(orders.items.slice(0, 5));
}

async function main() {
  const key = await getKey();
  if (mode === 'connector' || mode === 'all') await connectorDemo(key);
  if (mode === 'mcp' || mode === 'all') await mcpDemo(key);
  console.log('\nKlart. Använd --key <nyckel> eller miljövariabeln TBERG_KEY för att återanvända samma arbetsyta.');
}

main().catch((error) => {
  console.error('\nDemot misslyckades:', error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
