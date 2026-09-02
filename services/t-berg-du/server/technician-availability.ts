import { buildTechnicians } from './seed.js';
import type { Asset, TechnicianAvailability, WorkOrder } from './types.js';

export const UNASSIGNED_TECHNICIAN_ID = 'UNASSIGNED';

function hasSkill(skills: string[], requiredSkill: string) {
  const normalizedRequiredSkill = requiredSkill.trim().toLocaleLowerCase('sv-SE');
  return skills.some((skill) => skill.toLocaleLowerCase('sv-SE') === normalizedRequiredSkill);
}

export function buildTechnicianAvailability(workOrders: WorkOrder[], now = new Date()): TechnicianAvailability[] {
  return buildTechnicians(now).map((technician) => {
    const activeOrder = workOrders.find((order) => order.technicianId === technician.technicianId && order.status === 'Pågår');
    const plannedOrderCount = workOrders.filter((order) => order.technicianId === technician.technicianId && order.status === 'Planerad').length;
    const status = technician.status === 'Frånvarande' ? 'Frånvarande' : activeOrder ? 'Upptagen' : 'Tillgänglig';

    return {
      ...technician,
      status,
      plannedOrderCount,
      ...(activeOrder ? { activeWorkOrderId: activeOrder.workOrderId } : {}),
    };
  });
}

export function findAvailableTechnicians(requiredSkill: string, workOrders: WorkOrder[], now = new Date()) {
  return buildTechnicianAvailability(workOrders, now)
    .filter((technician) => technician.status === 'Tillgänglig' && hasSkill(technician.skills, requiredSkill))
    .sort((a, b) => a.plannedOrderCount - b.plannedOrderCount || a.availableFrom.localeCompare(b.availableFrom));
}

export function resolveTechnicianAssignment(technicianId: string | undefined, asset: Asset, workOrders: WorkOrder[]) {
  const normalizedTechnicianId = technicianId?.trim();
  if (!normalizedTechnicianId || normalizedTechnicianId.toUpperCase() === UNASSIGNED_TECHNICIAN_ID) return undefined;

  const technician = buildTechnicianAvailability(workOrders).find((item) => item.technicianId === normalizedTechnicianId);
  if (!technician) throw new Error(`Teknikern ${normalizedTechnicianId} finns inte.`);
  if (!hasSkill(technician.skills, asset.requiredSkill)) throw new Error(`${technician.name} saknar kompetensen ${asset.requiredSkill}.`);
  if (technician.status === 'Frånvarande') throw new Error(`${technician.name} är frånvarande och kan inte tilldelas.`);
  if (technician.status === 'Upptagen') throw new Error(`${technician.name} arbetar redan med arbetsorder ${technician.activeWorkOrderId}.`);
  return technician;
}
