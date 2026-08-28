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

export const technicians: Technician[] = [
  { technicianId: 'T-101', name: 'Anna Ek', skills: ['Industrimekanik', 'Tryckluft'], area: 'Hall A–C', availableFrom: '2026-08-28T13:00:00+02:00', status: 'Tillgänglig' },
  { technicianId: 'T-102', name: 'Oskar Berg', skills: ['Ventilation', 'Kyla'], area: 'Hela området', availableFrom: '2026-08-28T14:30:00+02:00', status: 'Tillgänglig' },
  { technicianId: 'T-103', name: 'Nadia Saleh', skills: ['Automation', 'IT/OT'], area: 'Linje 1–2', availableFrom: '2026-08-28T15:00:00+02:00', status: 'På uppdrag' },
  { technicianId: 'T-104', name: 'Erik Holm', skills: ['El', 'Automation'], area: 'Hall A–B', availableFrom: '2026-08-28T12:30:00+02:00', status: 'Tillgänglig' },
  { technicianId: 'T-105', name: 'Maja Norén', skills: ['Lyftteknik', 'Industrimekanik'], area: 'Hall C', availableFrom: '2026-08-29T07:00:00+02:00', status: 'Frånvarande' },
];

export const faultHistory: FaultHistoryEntry[] = [
  { historyId: 'H-001', assetId: 'VA-12', date: '2026-05-14', errorCode: 'E37', symptom: 'Ojämnt luftflöde och röd indikator', action: 'Filter och rem byttes', downtimeHours: 3.5 },
  { historyId: 'H-002', assetId: 'VA-12', date: '2025-11-03', errorCode: 'E37', symptom: 'Larm E37 efter uppstart', action: 'Givare rengjordes och kalibrerades', downtimeHours: 2 },
  { historyId: 'H-003', assetId: 'P-17', date: '2026-06-19', symptom: 'Vibrationer och lagerljud', action: 'Lager och tätning byttes', downtimeHours: 5 },
  { historyId: 'H-004', assetId: 'P-17', date: '2026-02-08', symptom: 'Mindre läckage vid axeltätning', action: 'Packning byttes', downtimeHours: 2.5 },
  { historyId: 'H-005', assetId: 'PK-04', date: '2026-07-01', errorCode: 'S14', symptom: 'Säkerhetsbrytare löste ut', action: 'Extern garantiservice', downtimeHours: 6 },
  { historyId: 'H-006', assetId: 'KP-08', date: '2026-01-22', symptom: 'Tryckfall under hög belastning', action: 'Luftfilter och ventil byttes', downtimeHours: 4 },
];

export function seedWorkOrders(workspaceId: string): WorkOrder[] {
  return [
    { workOrderId: 'AO-1048', workspaceId, assetId: 'P-17', title: 'Onormalt lagerljud', description: 'Kontrollera pumpens lager och axeltätning.', priority: 'P2', technicianId: 'T-101', technicianName: 'Anna Ek', status: 'Pågår', createdAt: '2026-08-28T08:15:00+02:00' },
    { workOrderId: 'AO-1047', workspaceId, assetId: 'VA-12', title: 'Planerad filterservice', description: 'Genomför filterbyte under planerat servicefönster.', priority: 'P3', technicianId: 'T-102', technicianName: 'Oskar Berg', status: 'Planerad', createdAt: '2026-08-27T14:30:00+02:00' },
    { workOrderId: 'AO-1046', workspaceId, assetId: 'PK-04', title: 'Kontroll av säkerhetsbrytare', description: 'Inväntar leverantörens garantibesked.', priority: 'P2', technicianId: 'T-103', technicianName: 'Nadia Saleh', status: 'Väntar', createdAt: '2026-08-27T10:05:00+02:00' },
  ];
}
