import type { Asset, FaultHistoryEntry, Technician, WorkOrder } from './types.js';

export const assets: Asset[] = [
  { assetId: 'VA-12', name: 'Ventilationsaggregat 12', type: 'Ventilation', location: 'Hall B', criticality: 'Hög', slaHours: 8, requiredSkill: 'Ventilation', warrantyActive: false, serviceType: 'Intern', status: 'Drift' },
  { assetId: 'P-17', name: 'Cirkulationspump 17', type: 'Pump', location: 'Teknikrum 2', criticality: 'Hög', slaHours: 4, requiredSkill: 'Industrimekanik', warrantyActive: false, serviceType: 'Intern', status: 'Tillsyn' },
  { assetId: 'PK-04', name: 'Packmaskin 04', type: 'Produktionsmaskin', location: 'Linje 1', criticality: 'Kritisk', slaHours: 2, requiredSkill: 'Automation', warrantyActive: true, serviceType: 'Extern', status: 'Drift' },
  { assetId: 'KP-08', name: 'Kompressor 08', type: 'Kompressor', location: 'Verkstad', criticality: 'Normal', slaHours: 24, requiredSkill: 'Tryckluft', warrantyActive: false, serviceType: 'Intern', status: 'Service' },
  { assetId: 'EL-22', name: 'Elcentral 22', type: 'Elanläggning', location: 'Hall A', criticality: 'Kritisk', slaHours: 2, requiredSkill: 'El', warrantyActive: false, serviceType: 'Intern', status: 'Drift' },
  { assetId: 'KY-03', name: 'Kylaggregat 03', type: 'Kyla', location: 'Lager 2', criticality: 'Hög', slaHours: 4, requiredSkill: 'Kyla', warrantyActive: true, serviceType: 'Extern', status: 'Drift' },
  { assetId: 'TR-09', name: 'Travers 09', type: 'Lyftutrustning', location: 'Hall C', criticality: 'Hög', slaHours: 8, requiredSkill: 'Lyftteknik', warrantyActive: false, serviceType: 'Intern', status: 'Drift' },
  { assetId: 'PR-31', name: 'Industriskrivare 31', type: 'Märkutrustning', location: 'Linje 2', criticality: 'Låg', slaHours: 48, requiredSkill: 'IT/OT', warrantyActive: true, serviceType: 'Extern', status: 'Drift' },
];

const technicianDefinitions: Array<Omit<Technician, 'availableFrom'> & { availableInMinutes: number }> = [
  { technicianId: 'T-101', name: 'Anna Ek', skills: ['Industrimekanik', 'Tryckluft'], area: 'Hela området', availableInMinutes: 60, status: 'Tillgänglig' },
  { technicianId: 'T-102', name: 'Oskar Berg', skills: ['Ventilation', 'Kyla'], area: 'Hela området', availableInMinutes: 90, status: 'Tillgänglig' },
  { technicianId: 'T-103', name: 'Nadia Saleh', skills: ['Automation', 'IT/OT'], area: 'Hela området', availableInMinutes: 240, status: 'På uppdrag' },
  { technicianId: 'T-104', name: 'Erik Holm', skills: ['El', 'Automation'], area: 'Hela området', availableInMinutes: 30, status: 'Tillgänglig' },
  { technicianId: 'T-105', name: 'Maja Norén', skills: ['Lyftteknik', 'Industrimekanik'], area: 'Hela området', availableInMinutes: 24 * 60, status: 'Frånvarande' },
];

export function buildTechnicians(now = new Date()): Technician[] {
  return technicianDefinitions.map(({ availableInMinutes, ...technician }) => ({
    ...technician,
    availableFrom: new Date(now.getTime() + availableInMinutes * 60_000).toISOString(),
  }));
}

export const faultHistory: FaultHistoryEntry[] = [
  { historyId: 'H-001', assetId: 'VA-12', date: '2026-05-14', errorCode: 'E37', symptom: 'Ojämnt luftflöde och röd indikator', action: 'Filter och rem byttes', downtimeHours: 3.5 },
  { historyId: 'H-002', assetId: 'VA-12', date: '2025-11-03', errorCode: 'E37', symptom: 'Larm E37 efter uppstart', action: 'Givare rengjordes och kalibrerades', downtimeHours: 2 },
  { historyId: 'H-003', assetId: 'P-17', date: '2026-06-19', symptom: 'Vibrationer och lagerljud', action: 'Lager och tätning byttes', downtimeHours: 5 },
  { historyId: 'H-004', assetId: 'P-17', date: '2026-02-08', symptom: 'Mindre läckage vid axeltätning', action: 'Packning byttes', downtimeHours: 2.5 },
  { historyId: 'H-005', assetId: 'PK-04', date: '2026-07-01', errorCode: 'S14', symptom: 'Säkerhetsbrytare löste ut', action: 'Extern garantiservice', downtimeHours: 6 },
  { historyId: 'H-006', assetId: 'KP-08', date: '2026-01-22', symptom: 'Tryckfall under hög belastning', action: 'Luftfilter och ventil byttes', downtimeHours: 4 },
];

export function seedWorkOrders(workspaceId: string, now = new Date()): WorkOrder[] {
  const hoursAgo = (hours: number) => new Date(now.getTime() - hours * 60 * 60_000).toISOString();
  return [
    { workOrderId: 'AO-1048', workspaceId, assetId: 'P-17', title: 'Onormalt lagerljud', description: 'Kontrollera pumpens lager och axeltätning.', priority: 'P2', technicianId: 'T-101', technicianName: 'Anna Ek', status: 'Pågår', createdAt: hoursAgo(2) },
    { workOrderId: 'AO-1047', workspaceId, assetId: 'VA-12', title: 'Planerad filterservice', description: 'Genomför filterbyte under planerat servicefönster.', priority: 'P3', technicianId: 'T-102', technicianName: 'Oskar Berg', status: 'Planerad', createdAt: hoursAgo(24) },
    { workOrderId: 'AO-1046', workspaceId, assetId: 'PK-04', title: 'Kontroll av säkerhetsbrytare', description: 'Inväntar leverantörens garantibesked.', priority: 'P2', technicianId: 'T-103', technicianName: 'Nadia Saleh', status: 'Väntar', createdAt: hoursAgo(28) },
  ];
}
