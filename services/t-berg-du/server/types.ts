export type Criticality = 'Låg' | 'Normal' | 'Hög' | 'Kritisk';
export type WorkOrderPriority = 'P1' | 'P2' | 'P3' | 'P4';

export interface Asset {
  assetId: string;
  name: string;
  type: string;
  location: string;
  criticality: Criticality;
  slaHours: number;
  requiredSkill: string;
  warrantyActive: boolean;
  serviceType: 'Intern' | 'Extern';
  status: 'Drift' | 'Tillsyn' | 'Service' | 'Stoppad';
}

export interface Technician {
  technicianId: string;
  name: string;
  skills: string[];
  area: string;
  availableFrom: string;
  status: 'Tillgänglig' | 'På uppdrag' | 'Frånvarande';
}

export interface FaultHistoryEntry {
  historyId: string;
  assetId: string;
  date: string;
  errorCode?: string;
  symptom: string;
  action: string;
  downtimeHours: number;
}

export interface WorkOrder {
  workOrderId: string;
  workspaceId: string;
  assetId: string;
  title: string;
  description: string;
  priority: WorkOrderPriority;
  technicianId?: string;
  technicianName?: string;
  status: 'Väntar' | 'Planerad' | 'Pågår' | 'Avslutad';
  createdAt: string;
}

export interface RuntimeData {
  workspaces: Record<string, { workOrders: WorkOrder[] }>;
  accessSessions: Record<string, AccessSession>;
}

export interface AccessSession {
  keyHash: string;
  workspaceId: string;
  createdAt: string;
  expiresAt: string;
  requestsUsed: number;
  requestLimit: number;
  workOrderLimit: number;
}

export interface CreateWorkOrderInput {
  workspaceId: string;
  assetId: string;
  title: string;
  description: string;
  priority: WorkOrderPriority;
  technicianId?: string;
}
