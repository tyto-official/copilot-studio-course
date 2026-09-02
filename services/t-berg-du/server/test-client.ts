import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { ASSET_ID_PATTERN } from './asset-id.js';

const baseUrl = process.env.API_BASE_URL || 'http://localhost:8787';
type KeyResult = { key: string; workspaceId: string };
type OrdersResult = { items: Array<{ workOrderId: string; createdAt: string; status: string; technicianId?: string }> };
type AssetResult = { assetId: string; requiredSkill: string };
type AssetsResult = { items: Array<{ assetId: string; serviceType: string; spareParts: Array<{ partNumber: string; stock: number; leadTimeDays: number }> }> };
type TechnicianResult = { items: Array<{ technicianId: string; area: string; availableFrom: string; status: string; plannedOrderCount: number; activeWorkOrderId?: string }> };
type TechnicianToolResult = { technicianId: string; count: number; technicians: Array<{ technicianId: string; status: string; plannedOrderCount: number }> };
type HistoryToolResult = { totalCount: number; historyCount: number; recentWorkOrderCount: number; queriedErrorCode: string; sameErrorCodeCount: number };
type SparePartsToolResult = { assetId: string; assetType: string; serviceType: string; checkPerformed: boolean; count: number; parts: Array<{ partNumber: string; stock: number; leadTimeDays: number }> };

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
  await request('/api/assets/LO-VA-012', {}, {}, 401);

  const first = await issueKey();
  const second = await issueKey();
  if (first.workspaceId === second.workspaceId) throw new Error('Testnycklarna fick samma arbetsyta.');
  const firstHeaders = { 'x-workshop-key': first.key };
  const secondHeaders = { 'x-workshop-key': second.key };

  const asset = await request<AssetResult>('/api/assets/LO-VA-012', firstHeaders);
  if (asset.requiredSkill !== 'Ventilation') throw new Error('Fel kompetenskrav för LO-VA-012.');
  const lowercaseAsset = await request<AssetResult>('/api/assets/lo-pu-017', firstHeaders);
  if (lowercaseAsset.assetId !== 'LO-PU-017') throw new Error('API:t normaliserade inte objekt-ID till versaler.');
  const assetList = await request<AssetsResult>('/api/assets', firstHeaders);
  if (assetList.items.some((item) => !ASSET_ID_PATTERN.test(item.assetId))) throw new Error('Objektregistret innehåller ett ID som inte följer LO-TT-NNN.');
  const pumpInList = assetList.items.find((item) => item.assetId === 'LO-PU-017');
  if (!pumpInList || pumpInList.spareParts.length !== 2 || !pumpInList.spareParts.some((part) => part.partNumber === 'TATN-MEK-25' && part.stock === 0 && part.leadTimeDays === 5)) {
    throw new Error('Objektlistan innehåller inte pumpens reservdelar med lager och ledtid.');
  }
  const externalAssetInList = assetList.items.find((item) => item.assetId === 'LO-PK-004');
  if (!externalAssetInList || externalAssetInList.serviceType !== 'Extern' || externalAssetInList.spareParts.length !== 0) {
    throw new Error('Objekt med extern service ska inte visa interna reservdelar.');
  }

  const technicianResult = await request<TechnicianResult>('/api/technicians', firstHeaders);
  const now = Date.now();
  if (technicianResult.items.some((technician) => technician.area !== 'Hela området')) throw new Error('En tekniker har ett oväntat ansvarsområde.');
  if (technicianResult.items.some((technician) => {
    const availableFrom = Date.parse(technician.availableFrom);
    return availableFrom < now - 60_000 || availableFrom > now + 25 * 60 * 60_000;
  })) throw new Error('Teknikernas tillgänglighet är inte relativ till aktuell tid.');
  const busyTechnician = technicianResult.items.find((technician) => technician.technicianId === 'T-104');
  if (busyTechnician?.status !== 'Upptagen' || busyTechnician.activeWorkOrderId !== 'AO-1048') throw new Error('Pågående arbetsorder gjorde inte Erik upptagen.');
  if (technicianResult.items.find((technician) => technician.technicianId === 'T-101')?.status !== 'Tillgänglig') throw new Error('Anna ska vara tillgänglig i en ny arbetsyta.');
  if (technicianResult.items.find((technician) => technician.technicianId === 'T-103')?.status !== 'Tillgänglig') throw new Error('Nadia ska vara tillgänglig i en ny arbetsyta.');

  const secondBefore = await request<OrdersResult>('/api/work-orders', secondHeaders);
  if (secondBefore.items.some((order) => {
    const createdAt = Date.parse(order.createdAt);
    return createdAt < now - 30 * 60 * 60_000 || createdAt > now + 60_000;
  })) throw new Error('Startarbetsordrarnas datum är inte relativa till arbetsytans starttid.');
  const unassignedOrder = await request<{ status: string; technicianId?: string }>('/api/work-orders', firstHeaders, {
    method: 'POST',
    body: JSON.stringify({ assetId: 'LO-VA-012', title: 'Isoleringstest', description: 'Ska endast synas i den första arbetsytan.', priority: 'P3', technicianId: 'UNASSIGNED' }),
  }, 201);
  if (unassignedOrder.status !== 'Väntar' || unassignedOrder.technicianId) throw new Error('UNASSIGNED skapade inte en otilldelad arbetsorder med status Väntar.');
  const firstAfter = await request<OrdersResult>('/api/work-orders', firstHeaders);
  const secondAfter = await request<OrdersResult>('/api/work-orders', secondHeaders);
  if (firstAfter.items.length !== secondBefore.items.length + 1) throw new Error('Arbetsordern skapades inte i den första arbetsytan.');
  if (secondAfter.items.length !== secondBefore.items.length) throw new Error('En arbetsorder läckte till den andra arbetsytan.');

  const client = new Client({ name: 't-berg-local-test', version: '0.1.0' });
  const transport = new StreamableHTTPClientTransport(new URL(`${baseUrl}/mcp`), { requestInit: { headers: firstHeaders } });
  await client.connect(transport);
  const tools = await client.listTools();
  if (tools.tools.length !== 4) throw new Error(`Förväntade 4 MCP-verktyg, fick ${tools.tools.length}.`);
  const history = await client.callTool({ name: 'get_fault_history', arguments: { assetId: 'LO-VA-012', errorCode: 'E37' } });
  if (history.isError) throw new Error('Felhistorikverktyget misslyckades.');
  const historyResult = history.structuredContent as HistoryToolResult | undefined;
  if (!historyResult || historyResult.historyCount !== 2 || historyResult.sameErrorCodeCount !== 2) throw new Error('Felhistoriken räknade inte alla poster och felkodsträffar separat.');

  const initialIndustrialMatches = await client.callTool({ name: 'find_available_technicians', arguments: { requiredSkill: 'Industrimekanik' } });
  const initialIndustrial = initialIndustrialMatches.structuredContent as TechnicianToolResult | undefined;
  if (!initialIndustrial || initialIndustrial.technicianId !== 'T-101' || initialIndustrial.technicians[0]?.technicianId !== 'T-101' || initialIndustrial.technicians[1]?.technicianId !== 'T-103') {
    throw new Error('Anna och Nadia sorterades inte rätt i en ny arbetsyta.');
  }
  const unavailableElectricalMatches = await client.callTool({ name: 'find_available_technicians', arguments: { requiredSkill: 'El' } });
  const unavailableElectrical = unavailableElectricalMatches.structuredContent as TechnicianToolResult | undefined;
  if (!unavailableElectrical || unavailableElectrical.count !== 0 || unavailableElectrical.technicianId !== 'UNASSIGNED') {
    throw new Error('En tom teknikerlista returnerade inte UNASSIGNED.');
  }

  const p1Order = await request<{ status: string }>('/api/work-orders', firstHeaders, {
    method: 'POST',
    body: JSON.stringify({ assetId: 'LO-PU-017', title: 'Läckage E-42', description: 'Felkod E-42. Pumpen står stilla.', priority: 'P1', technicianId: 'T-101' }),
  }, 201);
  if (p1Order.status !== 'Pågår') throw new Error('En tilldelad P1-order fick inte status Pågår.');

  const repeatHistory = await client.callTool({ name: 'get_fault_history', arguments: { assetId: 'LO-PU-017', errorCode: 'E42' } });
  const repeatHistoryResult = repeatHistory.structuredContent as HistoryToolResult | undefined;
  if (!repeatHistoryResult || repeatHistoryResult.historyCount !== 2 || repeatHistoryResult.recentWorkOrderCount !== 1 || repeatHistoryResult.sameErrorCodeCount !== 1) {
    throw new Error('En tidigare arbetsorder med samma felkod hittades inte tillsammans med objektets historik.');
  }

  const stoppedParts = await client.callTool({
    name: 'find_spare_parts',
    arguments: { assetId: 'LO-PU-017', impactLevel: 'Stoppad', sameErrorCodeCount: 0 },
  });
  const stoppedPartsResult = stoppedParts.structuredContent as SparePartsToolResult | undefined;
  if (!stoppedPartsResult?.checkPerformed || stoppedPartsResult.assetType !== 'Pump' || stoppedPartsResult.count !== 2) {
    throw new Error('Reservdelsverktyget kontrollerade inte delar för en stoppad intern pump.');
  }
  if (!stoppedPartsResult.parts.some((part) => part.partNumber === 'TATN-MEK-25' && part.stock === 0 && part.leadTimeDays === 5)) {
    throw new Error('Reservdelsverktyget returnerade inte lager och ledtid för pumpens axeltätning.');
  }

  const recurringParts = await client.callTool({
    name: 'find_spare_parts',
    arguments: { assetId: 'LO-PU-017', impactLevel: 'Begränsad', sameErrorCodeCount: 1 },
  });
  if (!(recurringParts.structuredContent as SparePartsToolResult | undefined)?.checkPerformed) {
    throw new Error('Reservdelsverktyget hoppade över ett återkommande fel på ett internt objekt.');
  }

  const unnecessaryParts = await client.callTool({
    name: 'find_spare_parts',
    arguments: { assetId: 'LO-PU-017', impactLevel: 'Begränsad', sameErrorCodeCount: 0 },
  });
  const unnecessaryPartsResult = unnecessaryParts.structuredContent as SparePartsToolResult | undefined;
  if (!unnecessaryPartsResult || unnecessaryPartsResult.checkPerformed || unnecessaryPartsResult.count !== 0) {
    throw new Error('Reservdelsverktyget kontrollerade delar utan stopp eller återkommande felkod.');
  }

  const externalParts = await client.callTool({
    name: 'find_spare_parts',
    arguments: { assetId: 'LO-PK-004', impactLevel: 'Stoppad', sameErrorCodeCount: 1 },
  });
  if ((externalParts.structuredContent as SparePartsToolResult | undefined)?.checkPerformed) {
    throw new Error('Reservdelsverktyget kontrollerade interna delar för ett objekt med extern service.');
  }

  const technicianMatches = await client.callTool({ name: 'find_available_technicians', arguments: { requiredSkill: 'Industrimekanik' } });
  if (technicianMatches.isError) throw new Error('Teknikerverktyget misslyckades.');
  const matchedTechnicians = technicianMatches.structuredContent as TechnicianToolResult | undefined;
  if (!matchedTechnicians || matchedTechnicians.count !== 1 || matchedTechnicians.technicianId !== 'T-103' || matchedTechnicians.technicians[0]?.technicianId !== 'T-103') {
    throw new Error('Teknikerverktyget uteslöt inte Anna när hennes P1-order pågick.');
  }
  if (matchedTechnicians.technicians.some((technician) => technician.status !== 'Tillgänglig')) throw new Error('Teknikerverktyget returnerade en otillgänglig tekniker.');

  const plannedOrder = await request<{ status: string }>('/api/work-orders', secondHeaders, {
    method: 'POST',
    body: JSON.stringify({ assetId: 'LO-PU-017', title: 'Planerad kontroll', description: 'Kontrollera pumpen vid nästa servicefönster.', priority: 'P3', technicianId: 'T-101' }),
  }, 201);
  if (plannedOrder.status !== 'Planerad') throw new Error('En tilldelad P3-order fick inte status Planerad.');

  const secondClient = new Client({ name: 't-berg-local-test-second', version: '0.1.0' });
  const secondTransport = new StreamableHTTPClientTransport(new URL(`${baseUrl}/mcp`), { requestInit: { headers: secondHeaders } });
  await secondClient.connect(secondTransport);
  const balancedMatches = await secondClient.callTool({ name: 'find_available_technicians', arguments: { requiredSkill: 'Industrimekanik' } });
  const balancedResult = balancedMatches.structuredContent as TechnicianToolResult | undefined;
  if (!balancedResult || balancedResult.technicianId !== 'T-103' || balancedResult.technicians[0]?.technicianId !== 'T-103' || balancedResult.technicians[1]?.technicianId !== 'T-101') {
    throw new Error('Planerad belastning gjorde inte Nadia till första val.');
  }
  await secondClient.close();
  const created = await client.callTool({
    name: 'create_work_order',
    arguments: { assetId: 'LO-VA-012', title: 'MCP-test', description: 'Skapad efter godkännande.', priority: 'P2', approved: true },
  });
  if (created.isError) throw new Error('MCP kunde inte skapa arbetsordern.');
  await client.close();

  const finalFirst = await request<OrdersResult>('/api/work-orders', firstHeaders);
  const finalSecond = await request<OrdersResult>('/api/work-orders', secondHeaders);
  if (finalFirst.items.length !== secondBefore.items.length + 3) throw new Error('MCP- och REST-arbetsordrarna hamnade inte i den första arbetsytan.');
  if (finalSecond.items.length !== secondBefore.items.length + 1) throw new Error('Den andra arbetsytans planerade order saknas eller innehåller data från den första arbetsytan.');
  console.log('Nyckel-, historik-, tekniker-, reservdels-, isolerings-, REST- och MCP-tester godkända.');
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
