import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { ASSET_ID_INPUT_PATTERN } from './asset-id.js';
import { createWorkOrder, findTechnicians, getAsset, getFaultHistory, getWorkOrders } from './store.js';

function normalizeErrorCode(value: string) {
  return value.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
}

function textContainsErrorCode(text: string, errorCode: string) {
  const expected = normalizeErrorCode(errorCode);
  const candidates = text.toUpperCase().match(/\b[A-Z]{1,3}[\s-]?\d{1,4}\b/g) || [];
  return candidates.some((candidate) => normalizeErrorCode(candidate) === expected);
}

export function createTbergMcpServer(workspaceId: string, workOrderLimit: number) {
  const server = new McpServer({ name: 't-berg-du', version: '0.1.0' });

  server.registerTool('get_fault_history', {
    title: 'Hämta felhistorik',
    description: 'Hämtar tidigare fel och utförda åtgärder för ett redan identifierat objekt. Använd verktyget när topicen behöver bedöma om felet är återkommande.',
    inputSchema: {
      assetId: z.string().regex(ASSET_ID_INPUT_PATTERN).describe('Objektets verifierade ID i formatet LO-TT-NNN, exempelvis LO-VA-012.'),
      errorCode: z.string().optional().describe('Eventuell felkod som identifierats i bilden.'),
    },
    annotations: { readOnlyHint: true, openWorldHint: false },
  }, async ({ assetId, errorCode }) => {
    const asset = getAsset(assetId);
    if (!asset) return { content: [{ type: 'text', text: `Objektet ${assetId} finns inte.` }], isError: true };
    const entries = getFaultHistory(asset.assetId);
    const recentWorkOrders = (await getWorkOrders(workspaceId))
      .filter((order) => order.assetId === asset.assetId)
      .map((order) => ({
        workOrderId: order.workOrderId,
        createdAt: order.createdAt,
        title: order.title,
        description: order.description,
        priority: order.priority,
        status: order.status,
      }));
    const matchingHistoryCount = errorCode
      ? entries.filter((entry) => entry.errorCode && normalizeErrorCode(entry.errorCode) === normalizeErrorCode(errorCode)).length
      : 0;
    const matchingWorkOrderCount = errorCode
      ? recentWorkOrders.filter((order) => textContainsErrorCode(`${order.title} ${order.description}`, errorCode)).length
      : 0;
    const sameErrorCodeCount = matchingHistoryCount + matchingWorkOrderCount;
    const structuredContent = {
      assetId: asset.assetId,
      totalCount: entries.length + recentWorkOrders.length,
      historyCount: entries.length,
      recentWorkOrderCount: recentWorkOrders.length,
      queriedErrorCode: errorCode || '',
      sameErrorCodeCount,
      entries,
      recentWorkOrders,
    };
    return {
      structuredContent,
      content: [{ type: 'text', text: structuredContent.totalCount ? JSON.stringify(structuredContent, null, 2) : `Ingen tidigare felhistorik eller arbetsorder hittades för ${asset.assetId}.` }],
    };
  });

  server.registerTool('find_available_technicians', {
    title: 'Hitta tillgängliga tekniker',
    description: 'Söker tekniker med rätt kompetens som inte är frånvarande eller arbetar med en pågående order. Tekniker med färre planerade order visas först. Använd verktyget först efter att connectorn har hämtat requiredSkill.',
    inputSchema: {
      requiredSkill: z.string().describe('Kompetenskravet från objektregistret.'),
    },
    annotations: { readOnlyHint: true, openWorldHint: false },
  }, async ({ requiredSkill }) => {
    const matches = await findTechnicians(workspaceId, requiredSkill);
    return {
      structuredContent: { requiredSkill, count: matches.length, technicians: matches },
      content: [{ type: 'text', text: matches.length ? JSON.stringify(matches, null, 2) : `Ingen tekniker med kompetensen ${requiredSkill} hittades.` }],
    };
  });

  server.registerTool('create_work_order', {
    title: 'Skapa arbetsorder',
    description: 'Skapar den arbetsorder som användaren eller godkännaren redan har bekräftat. Verktyget får aldrig användas före topicens bekräftelse- och godkännandesteg.',
    inputSchema: {
      assetId: z.string().regex(ASSET_ID_INPUT_PATTERN).describe('Verifierat objekt-ID i formatet LO-TT-NNN.'),
      title: z.string().min(3).describe('Kort rubrik för arbetsordern.'),
      description: z.string().min(3).describe('Sammanfattat fel och beslutad åtgärd.'),
      priority: z.enum(['P1', 'P2', 'P3', 'P4']).describe('Prioritet som topicens fasta regler har beslutat.'),
      technicianId: z.string().optional().describe('Vald tekniker, om en tekniker har godkänts.'),
      approved: z.boolean().describe('Måste vara true efter mänskligt godkännande.'),
    },
    annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  }, async ({ approved, ...input }) => {
    if (!approved) return { content: [{ type: 'text', text: 'Arbetsordern skapades inte eftersom godkännande saknas.' }], isError: true };
    try {
      const order = await createWorkOrder({ ...input, workspaceId }, workOrderLimit);
      return {
        structuredContent: { ...order } as Record<string, unknown>,
        content: [{ type: 'text', text: `Arbetsorder ${order.workOrderId} skapades för ${order.assetId}. Status: ${order.status}.` }],
      };
    } catch (error) {
      return { content: [{ type: 'text', text: error instanceof Error ? error.message : 'Arbetsordern kunde inte skapas.' }], isError: true };
    }
  });

  return server;
}
