import type { Asset, FaultHistoryEntry, SparePart, Technician, WorkOrder } from './types.js';
import { ASSET_ID_PATTERN } from './asset-id.js';

export const assetIds = {
  ventilationUnit: 'LO-VA-012',
  circulationPump: 'LO-PU-017',
  packingMachine: 'LO-PK-004',
  compressor: 'LO-KP-008',
  electricalPanel: 'LO-EL-022',
  coolingUnit: 'LO-KY-003',
  overheadCrane: 'LO-TR-009',
  industrialPrinter: 'LO-PR-031',
} as const;

export const assets: Asset[] = [
  { assetId: assetIds.ventilationUnit, name: 'Ventilationsaggregat 12', type: 'Ventilation', location: 'Hall B', criticality: 'Hög', slaHours: 8, requiredSkill: 'Ventilation', warrantyActive: false, serviceType: 'Intern', status: 'Drift' },
  { assetId: assetIds.circulationPump, name: 'Cirkulationspump 17', type: 'Pump', location: 'Teknikrum 2', criticality: 'Hög', slaHours: 4, requiredSkill: 'Industrimekanik', warrantyActive: false, serviceType: 'Intern', status: 'Tillsyn' },
  { assetId: assetIds.packingMachine, name: 'Packmaskin 04', type: 'Produktionsmaskin', location: 'Linje 1', criticality: 'Kritisk', slaHours: 2, requiredSkill: 'Automation', warrantyActive: true, serviceType: 'Extern', status: 'Drift' },
  { assetId: assetIds.compressor, name: 'Kompressor 08', type: 'Kompressor', location: 'Verkstad', criticality: 'Normal', slaHours: 24, requiredSkill: 'Tryckluft', warrantyActive: false, serviceType: 'Intern', status: 'Service' },
  { assetId: assetIds.electricalPanel, name: 'Elcentral 22', type: 'Elanläggning', location: 'Hall A', criticality: 'Kritisk', slaHours: 2, requiredSkill: 'El', warrantyActive: false, serviceType: 'Intern', status: 'Drift' },
  { assetId: assetIds.coolingUnit, name: 'Kylaggregat 03', type: 'Kyla', location: 'Lager 2', criticality: 'Hög', slaHours: 4, requiredSkill: 'Kyla', warrantyActive: true, serviceType: 'Extern', status: 'Drift' },
  { assetId: assetIds.overheadCrane, name: 'Travers 09', type: 'Lyftutrustning', location: 'Hall C', criticality: 'Hög', slaHours: 8, requiredSkill: 'Lyftteknik', warrantyActive: false, serviceType: 'Intern', status: 'Drift' },
  { assetId: assetIds.industrialPrinter, name: 'Industriskrivare 31', type: 'Märkutrustning', location: 'Linje 2', criticality: 'Låg', slaHours: 48, requiredSkill: 'IT/OT', warrantyActive: true, serviceType: 'Extern', status: 'Drift' },
];

const invalidAsset = assets.find((asset) => !ASSET_ID_PATTERN.test(asset.assetId));
if (invalidAsset) throw new Error(`Objekt-ID ${invalidAsset.assetId} följer inte formatet LO-TT-NNN.`);
if (new Set(assets.map((asset) => asset.assetId)).size !== assets.length) throw new Error('Objektregistret innehåller dubbla objekt-ID:n.');

const technicianDefinitions: Array<Omit<Technician, 'availableFrom'> & { availableInMinutes: number }> = [
  { technicianId: 'T-101', name: 'Anna Ek', skills: ['Industrimekanik', 'Tryckluft'], area: 'Hela området', availableInMinutes: 30, status: 'Tillgänglig' },
  { technicianId: 'T-102', name: 'Oskar Berg', skills: ['Ventilation', 'Kyla'], area: 'Hela området', availableInMinutes: 90, status: 'Tillgänglig' },
  { technicianId: 'T-103', name: 'Nadia Saleh', skills: ['Industrimekanik', 'Automation', 'IT/OT'], area: 'Hela området', availableInMinutes: 60, status: 'Tillgänglig' },
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
  { historyId: 'H-001', assetId: assetIds.ventilationUnit, date: '2026-05-14', errorCode: 'E37', symptom: 'Ojämnt luftflöde och röd indikator', action: 'Filter och rem byttes', downtimeHours: 3.5 },
  { historyId: 'H-002', assetId: assetIds.ventilationUnit, date: '2025-11-03', errorCode: 'E37', symptom: 'Larm E37 efter uppstart', action: 'Givare rengjordes och kalibrerades', downtimeHours: 2 },
  { historyId: 'H-003', assetId: assetIds.circulationPump, date: '2026-06-19', symptom: 'Vibrationer och lagerljud', action: 'Lager och tätning byttes', downtimeHours: 5 },
  { historyId: 'H-004', assetId: assetIds.circulationPump, date: '2026-02-08', symptom: 'Mindre läckage vid axeltätning', action: 'Packning byttes', downtimeHours: 2.5 },
  { historyId: 'H-005', assetId: assetIds.packingMachine, date: '2026-07-01', errorCode: 'S14', symptom: 'Säkerhetsbrytare löste ut', action: 'Extern garantiservice', downtimeHours: 6 },
  { historyId: 'H-006', assetId: assetIds.compressor, date: '2026-01-22', symptom: 'Tryckfall under hög belastning', action: 'Luftfilter och ventil byttes', downtimeHours: 4 },
];

export const sparePartsByAssetType: Record<string, SparePart[]> = {
  Ventilation: [
    { partNumber: 'FILTER-F7-592', name: 'Påsfilter F7 592 x 592 mm', stock: 4, leadTimeDays: 0 },
    { partNumber: 'REM-SPZ-1250', name: 'Kilrem SPZ 1250', stock: 1, leadTimeDays: 0 },
  ],
  Pump: [
    { partNumber: 'LAGER-6204', name: 'Kullager 6204', stock: 3, leadTimeDays: 0 },
    { partNumber: 'TATN-MEK-25', name: 'Mekanisk axeltätning 25 mm', stock: 0, leadTimeDays: 5 },
  ],
  Kompressor: [
    { partNumber: 'FILTER-LUFT-08', name: 'Luftfilter till kompressor 08', stock: 2, leadTimeDays: 0 },
    { partNumber: 'VENTIL-TRYCK-08', name: 'Tryckventil till kompressor 08', stock: 0, leadTimeDays: 7 },
  ],
  Elanläggning: [
    { partNumber: 'SAKR-NH00-63A', name: 'NH-säkring 63 A', stock: 6, leadTimeDays: 0 },
    { partNumber: 'KONTAKTOR-32A', name: 'Kontaktor 32 A', stock: 2, leadTimeDays: 0 },
  ],
  Lyftutrustning: [
    { partNumber: 'GRANSLAGE-TR09', name: 'Gränslägesbrytare till travers 09', stock: 1, leadTimeDays: 0 },
    { partNumber: 'BROMSBELAGG-TR09', name: 'Bromsbeläggssats till travers 09', stock: 0, leadTimeDays: 10 },
  ],
};

export function seedWorkOrders(workspaceId: string, now = new Date()): WorkOrder[] {
  const hoursAgo = (hours: number) => new Date(now.getTime() - hours * 60 * 60_000).toISOString();
  return [
    { workOrderId: 'AO-1048', workspaceId, assetId: assetIds.electricalPanel, title: 'Felsökning av elcentral', description: 'Kontrollera återkommande spänningsbortfall i elcentralen.', priority: 'P1', technicianId: 'T-104', technicianName: 'Erik Holm', status: 'Pågår', createdAt: hoursAgo(2) },
    { workOrderId: 'AO-1047', workspaceId, assetId: assetIds.ventilationUnit, title: 'Planerad filterservice', description: 'Genomför filterbyte under planerat servicefönster.', priority: 'P3', technicianId: 'T-102', technicianName: 'Oskar Berg', status: 'Planerad', createdAt: hoursAgo(24) },
    { workOrderId: 'AO-1046', workspaceId, assetId: assetIds.packingMachine, title: 'Kontroll av säkerhetsbrytare', description: 'Inväntar leverantörens garantibesked.', priority: 'P2', status: 'Väntar', createdAt: hoursAgo(28) },
  ];
}
