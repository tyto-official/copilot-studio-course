import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { ASSET_ID_INPUT_PATTERN } from './asset-id.js';
import { createWorkOrder, findTechnicians, getAsset, getFaultHistory } from './store.js';

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
    const entries = getFaultHistory(asset.assetId, errorCode);
    return {
      structuredContent: { assetId: asset.assetId, count: entries.length, entries },
      content: [{ type: 'text', text: entries.length ? JSON.stringify(entries, null, 2) : `Ingen matchande felhistorik hittades för ${asset.assetId}.` }],
    };
  });

  server.registerTool('find_available_technicians', {
    title: 'Hitta tillgängliga tekniker',
    description: 'Söker tillgängliga tekniker med den verifierade kompetens som objektet kräver och sorterar dem efter tidigaste möjliga tid. Använd verktyget först efter att connectorn har hämtat requiredSkill.',
    inputSchema: {
      requiredSkill: z.string().describe('Kompetenskravet från objektregistret.'),
    },
    annotations: { readOnlyHint: true, openWorldHint: false },
  }, async ({ requiredSkill }) => {
    const matches = findTechnicians(requiredSkill);
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
