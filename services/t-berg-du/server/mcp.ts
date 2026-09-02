import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { ASSET_ID_INPUT_PATTERN } from './asset-id.js';
import { createWorkOrder, findTechnicians, getAsset, getFaultHistory, getSpareParts, getWorkOrders } from './store.js';
import { UNASSIGNED_TECHNICIAN_ID } from './technician-availability.js';

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
    description: 'Hämtar felhistorik och befintliga arbetsordrar för ett verifierat objekt. Använd verktyget efter att ämnet har lämnat MaintenanceContext. Svaret innehåller historiken, arbetsordrarna och antalet träffar för den angivna felkoden utan att filtrera bort övriga poster.',
    inputSchema: {
      assetId: z.string().regex(ASSET_ID_INPUT_PATTERN).describe('Verifierat objekt-ID från MaintenanceContext.'),
      errorCode: z.string().optional().describe('Felkod från MaintenanceContext. Används för att räkna träffar med samma felkod och filtrerar inte bort övrig historik.'),
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
    description: 'Söker tekniker med rätt kompetens som inte är frånvarande eller har en pågående arbetsorder. Använd verktyget när MaintenanceContext innehåller requiredSkill. Svaret innehåller en sorterad teknikerlista och technicianId med den första teknikerns ID eller UNASSIGNED.',
    inputSchema: {
      requiredSkill: z.string().describe('Kompetenskrav från MaintenanceContext.'),
    },
    annotations: { readOnlyHint: true, openWorldHint: false },
  }, async ({ requiredSkill }) => {
    const matches = await findTechnicians(workspaceId, requiredSkill);
    const structuredContent = {
      requiredSkill,
      count: matches.length,
      technicianId: matches[0]?.technicianId ?? UNASSIGNED_TECHNICIAN_ID,
      technicians: matches,
    };
    return {
      structuredContent,
      content: [{ type: 'text', text: JSON.stringify(structuredContent, null, 2) }],
    };
  });

  server.registerTool('find_spare_parts', {
    title: 'Kontrollera reservdelar',
    description: 'Kontrollerar reservdelar, lagersaldo och ledtid för ett internt objekt. Använd verktyget efter get_fault_history när serviceType är Intern och antingen impactLevel är Stoppad eller sameErrorCodeCount är större än 0. Svaret visar om kontrollen utfördes och vilka reservdelar som hittades; inget reserveras eller beställs.',
    inputSchema: {
      assetId: z.string().regex(ASSET_ID_INPUT_PATTERN).describe('Verifierat objekt-ID från MaintenanceContext.'),
      impactLevel: z.enum(['Liten', 'Begränsad', 'Stoppad', 'Säkerhetsrisk', 'Okänd']).describe('Påverkan från MaintenanceContext.'),
      sameErrorCodeCount: z.number().int().min(0).describe('Antal tidigare träffar för samma felkod från get_fault_history.'),
    },
    annotations: { readOnlyHint: true, openWorldHint: false },
  }, async ({ assetId, impactLevel, sameErrorCodeCount }) => {
    const asset = getAsset(assetId);
    if (!asset) return { content: [{ type: 'text', text: `Objektet ${assetId} finns inte.` }], isError: true };

    const stopped = impactLevel === 'Stoppad';
    const recurringError = sameErrorCodeCount > 0;
    const internalService = asset.serviceType === 'Intern';
    const checkPerformed = internalService && (stopped || recurringError);
    const reason = !internalService
      ? 'Objektet har extern service.'
      : stopped && recurringError
        ? 'Driften är stoppad och samma felkod har förekommit tidigare.'
        : stopped
          ? 'Driften är stoppad.'
          : recurringError
            ? 'Samma felkod har förekommit tidigare.'
            : 'Driften är inte stoppad och samma felkod har inte förekommit tidigare.';
    const parts = checkPerformed ? getSpareParts(asset.type) : [];
    const structuredContent = {
      assetId: asset.assetId,
      assetType: asset.type,
      serviceType: asset.serviceType,
      checkPerformed,
      reason,
      count: parts.length,
      parts,
    };

    return {
      structuredContent,
      content: [{
        type: 'text',
        text: checkPerformed
          ? parts.length
            ? JSON.stringify(structuredContent, null, 2)
            : `Inga registrerade reservdelar hittades för ${asset.assetId}.`
          : `Reservdelskontrollen hoppades över. ${reason}`,
      }],
    };
  });

  server.registerTool('create_work_order', {
    title: 'Skapa arbetsorder',
    description: 'Skapar en arbetsorder från ett verifierat underlag. Använd verktyget först efter att användaren har bekräftat underlaget och approved är true. Svaret innehåller den skapade arbetsorderns uppgifter.',
    inputSchema: {
      assetId: z.string().regex(ASSET_ID_INPUT_PATTERN).describe('Verifierat objekt-ID i formatet LO-TT-NNN.'),
      title: z.string().min(3).describe('Kort rubrik för arbetsordern.'),
      description: z.string().min(3).describe('Sammanfattat fel och beslutad åtgärd.'),
      priority: z.enum(['P1', 'P2', 'P3', 'P4']).describe('Prioritet som ämnets fasta regler har satt. Värdet får inte räknas om.'),
      technicianId: z.string().optional().describe('Tekniker-ID från find_available_technicians eller UNASSIGNED när ingen tekniker är tillgänglig.'),
      approved: z.boolean().describe('Sätt till true först efter att användaren har bekräftat underlaget.'),
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
