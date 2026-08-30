import { createHash, randomBytes } from 'node:crypto';
import { DefaultAzureCredential } from '@azure/identity';
import { TableClient, type TableEntity, type TransactionAction } from '@azure/data-tables';
import { assets, buildTechnicians, faultHistory, seedWorkOrders } from './seed.js';
import type { AccessSession, CreateWorkOrderInput, WorkOrder } from './types.js';

const sessionHours = Number(process.env.ACCESS_SESSION_HOURS || 24);
const requestLimit = Number(process.env.ACCESS_REQUEST_LIMIT || 500);
const workOrderLimit = Number(process.env.ACCESS_WORK_ORDER_LIMIT || 20);
const tableNames = {
  sessions: process.env.AZURE_TABLE_SESSIONS || 'TbergAccessSessions',
  workspaces: process.env.AZURE_TABLE_WORKSPACES || 'TbergWorkspaces',
  workOrders: process.env.AZURE_TABLE_WORK_ORDERS || 'TbergWorkOrders',
};

type AccessSessionEntity = TableEntity<{
  workspaceId: string;
  createdAt: string;
  expiresAt: string;
  requestsUsed: number;
  requestLimit: number;
  workOrderLimit: number;
}>;

type WorkspaceEntity = TableEntity<{ createdAt: string; expiresAt: string }>;
type WorkOrderEntity = TableEntity<Omit<WorkOrder, 'workspaceId' | 'workOrderId'>>;

let clients: { sessions: TableClient; workspaces: TableClient; workOrders: TableClient } | undefined;
let ensureTablesPromise: Promise<void> | undefined;
let mutationQueue: Promise<unknown> = Promise.resolve();

function hashKey(rawKey: string) {
  return createHash('sha256').update(rawKey).digest('hex');
}

function tableClient(tableName: string) {
  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
  if (connectionString) return TableClient.fromConnectionString(connectionString, tableName);

  const endpoint = process.env.AZURE_TABLES_ENDPOINT || (process.env.AZURE_STORAGE_ACCOUNT
    ? `https://${process.env.AZURE_STORAGE_ACCOUNT}.table.core.windows.net`
    : '');
  if (!endpoint) throw new Error('AZURE_TABLES_ENDPOINT eller AZURE_STORAGE_ACCOUNT måste anges för Azure-lagring.');
  return new TableClient(endpoint, tableName, new DefaultAzureCredential());
}

function getClients() {
  if (!clients) {
    clients = {
      sessions: tableClient(tableNames.sessions),
      workspaces: tableClient(tableNames.workspaces),
      workOrders: tableClient(tableNames.workOrders),
    };
  }
  return clients;
}

async function ensureTables() {
  if (!ensureTablesPromise) {
    const current = getClients();
    ensureTablesPromise = Promise.all([
      current.sessions.createTable(),
      current.workspaces.createTable(),
      current.workOrders.createTable(),
    ]).then(() => undefined).catch((error) => {
      ensureTablesPromise = undefined;
      throw error;
    });
  }
  return ensureTablesPromise;
}

function mutateAzure<T>(mutation: () => T | Promise<T>): Promise<T> {
  const operation = mutationQueue.then(async () => {
    await ensureTables();
    return mutation();
  });
  mutationQueue = operation.catch(() => undefined);
  return operation;
}

function sessionFromEntity(entity: AccessSessionEntity): AccessSession {
  return {
    keyHash: entity.rowKey,
    workspaceId: entity.workspaceId,
    createdAt: entity.createdAt,
    expiresAt: entity.expiresAt,
    requestsUsed: entity.requestsUsed,
    requestLimit: entity.requestLimit,
    workOrderLimit: entity.workOrderLimit,
  };
}

function publicSession(session: AccessSession) {
  return {
    workspaceId: session.workspaceId,
    createdAt: session.createdAt,
    expiresAt: session.expiresAt,
    requestsUsed: session.requestsUsed,
    requestLimit: session.requestLimit,
    requestsRemaining: Math.max(0, session.requestLimit - session.requestsUsed),
    workOrderLimit: session.workOrderLimit,
  };
}

function orderToEntity(order: WorkOrder): WorkOrderEntity {
  return {
    partitionKey: order.workspaceId,
    rowKey: order.workOrderId,
    assetId: order.assetId,
    title: order.title,
    description: order.description,
    priority: order.priority,
    status: order.status,
    createdAt: order.createdAt,
    ...(order.technicianId ? { technicianId: order.technicianId } : {}),
    ...(order.technicianName ? { technicianName: order.technicianName } : {}),
  };
}

function orderFromEntity(entity: WorkOrderEntity): WorkOrder {
  return {
    workOrderId: entity.rowKey,
    workspaceId: entity.partitionKey,
    assetId: entity.assetId,
    title: entity.title,
    description: entity.description,
    priority: entity.priority,
    status: entity.status,
    createdAt: entity.createdAt,
    ...(entity.technicianId ? { technicianId: entity.technicianId } : {}),
    ...(entity.technicianName ? { technicianName: entity.technicianName } : {}),
  };
}

function filterPartition(partitionKey: string) {
  return `PartitionKey eq '${partitionKey.replaceAll("'", "''")}'`;
}

async function listWorkspaceOrders(workspaceId: string) {
  const result: WorkOrder[] = [];
  for await (const entity of getClients().workOrders.listEntities<WorkOrderEntity>({ queryOptions: { filter: filterPartition(workspaceId) } })) {
    result.push(orderFromEntity(entity));
  }
  return result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

async function deleteWorkspaceOrders(workspaceId: string) {
  const actions: TransactionAction[] = [];
  for await (const entity of getClients().workOrders.listEntities({ queryOptions: { filter: filterPartition(workspaceId) } })) {
    if (!entity.rowKey) continue;
    actions.push(['delete', { partitionKey: workspaceId, rowKey: entity.rowKey }]);
  }
  if (actions.length) await getClients().workOrders.submitTransaction(actions);
}

async function deleteWorkspace(workspaceId: string) {
  await deleteWorkspaceOrders(workspaceId);
  await getClients().workspaces.deleteEntity(workspaceId, 'workspace').catch(() => undefined);
}

async function cleanExpiredInternal() {
  const now = Date.now();
  let removed = 0;
  for await (const entity of getClients().sessions.listEntities<AccessSessionEntity>()) {
    if (Date.parse(entity.expiresAt) > now) continue;
    await deleteWorkspace(entity.workspaceId);
    await getClients().sessions.deleteEntity(entity.partitionKey, entity.rowKey).catch(() => undefined);
    removed += 1;
  }
  return removed;
}

export async function createAccessSession() {
  return mutateAzure(async () => {
    await cleanExpiredInternal();
    const rawKey = `tberg_${randomBytes(24).toString('base64url')}`;
    const keyHash = hashKey(rawKey);
    const workspaceId = `DEMO-${randomBytes(4).toString('hex').toUpperCase()}`;
    const createdAt = new Date();
    const expiresAt = new Date(createdAt.getTime() + sessionHours * 60 * 60_000);
    const session: AccessSession = {
      keyHash,
      workspaceId,
      createdAt: createdAt.toISOString(),
      expiresAt: expiresAt.toISOString(),
      requestsUsed: 0,
      requestLimit,
      workOrderLimit,
    };

    const sessionEntity: AccessSessionEntity = { partitionKey: 'access', rowKey: keyHash, ...session };
    const workspaceEntity: WorkspaceEntity = {
      partitionKey: workspaceId,
      rowKey: 'workspace',
      createdAt: session.createdAt,
      expiresAt: session.expiresAt,
    };

    try {
      await getClients().sessions.createEntity(sessionEntity);
      await getClients().workspaces.createEntity(workspaceEntity);
      const seedActions: TransactionAction[] = seedWorkOrders(workspaceId).map((order) => ['create', orderToEntity(order)]);
      await getClients().workOrders.submitTransaction(seedActions);
    } catch (error) {
      await getClients().sessions.deleteEntity('access', keyHash).catch(() => undefined);
      await deleteWorkspace(workspaceId);
      throw error;
    }

    return { key: rawKey, ...publicSession(session) };
  });
}

export async function consumeAccessKey(rawKey: string) {
  return mutateAzure(async () => {
    await cleanExpiredInternal();
    let entity: AccessSessionEntity;
    try {
      entity = await getClients().sessions.getEntity<AccessSessionEntity>('access', hashKey(rawKey));
    } catch {
      throw new Error('Nyckeln är ogiltig eller har löpt ut. Skapa en ny testnyckel.');
    }
    const session = sessionFromEntity(entity);
    if (Date.parse(session.expiresAt) <= Date.now()) throw new Error('Nyckeln är ogiltig eller har löpt ut. Skapa en ny testnyckel.');
    if (session.requestsUsed >= session.requestLimit) throw new Error('Nyckelns anropskvot är förbrukad. Skapa en ny testnyckel.');
    session.requestsUsed += 1;
    await getClients().sessions.updateEntity({ ...entity, requestsUsed: session.requestsUsed }, 'Replace');
    return publicSession(session);
  });
}

export async function getWorkOrders(workspaceId: string) {
  await ensureTables();
  return listWorkspaceOrders(workspaceId);
}

export async function createWorkOrder(input: CreateWorkOrderInput, maximumOrders = workOrderLimit): Promise<WorkOrder> {
  return mutateAzure(async () => {
    try {
      await getClients().workspaces.getEntity(input.workspaceId, 'workspace');
    } catch {
      throw new Error('Testmiljön finns inte längre. Skapa en ny testnyckel.');
    }
    const currentOrders = await listWorkspaceOrders(input.workspaceId);
    if (currentOrders.length >= maximumOrders) throw new Error(`Arbetsytan får innehålla högst ${maximumOrders} arbetsordrar.`);
    const asset = getAsset(input.assetId);
    if (!asset) throw new Error(`Objektet ${input.assetId} finns inte.`);

    const technician = input.technicianId ? buildTechnicians().find((item) => item.technicianId === input.technicianId) : undefined;
    const order: WorkOrder = {
      workOrderId: `AO-${Date.now().toString(36).toUpperCase()}-${randomBytes(2).toString('hex').toUpperCase()}`,
      workspaceId: input.workspaceId,
      assetId: asset.assetId,
      title: input.title,
      description: input.description,
      priority: input.priority,
      technicianId: technician?.technicianId,
      technicianName: technician?.name,
      status: technician ? 'Planerad' : 'Väntar',
      createdAt: new Date().toISOString(),
    };
    await getClients().workOrders.createEntity(orderToEntity(order));
    return order;
  });
}

export async function resetWorkspace(workspaceId: string) {
  return mutateAzure(async () => {
    try {
      await getClients().workspaces.getEntity(workspaceId, 'workspace');
    } catch {
      throw new Error('Testmiljön finns inte längre.');
    }
    await deleteWorkspaceOrders(workspaceId);
    const orders = seedWorkOrders(workspaceId);
    const actions: TransactionAction[] = orders.map((order) => ['create', orderToEntity(order)]);
    await getClients().workOrders.submitTransaction(actions);
    return { workOrders: orders };
  });
}

export async function cleanupExpiredSessions() {
  return mutateAzure(cleanExpiredInternal);
}

export function getAssets() { return assets; }
export function getAsset(assetId: string) { return assets.find((asset) => asset.assetId.toUpperCase() === assetId.toUpperCase()); }
export function getTechnicians() { return buildTechnicians(); }
export function getFaultHistory(assetId: string, errorCode?: string) {
  return faultHistory.filter((entry) => entry.assetId === assetId && (!errorCode || entry.errorCode === errorCode));
}
export function findTechnicians(requiredSkill: string) {
  return buildTechnicians()
    .filter((technician) => technician.status === 'Tillgänglig' && technician.skills.some((skill) => skill.toLowerCase() === requiredSkill.toLowerCase()))
    .sort((a, b) => a.availableFrom.localeCompare(b.availableFrom));
}
