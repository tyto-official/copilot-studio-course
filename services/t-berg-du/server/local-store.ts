import { createHash, randomBytes } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { assets, buildTechnicians, faultHistory, seedWorkOrders } from './seed.js';
import type { AccessSession, CreateWorkOrderInput, RuntimeData, WorkOrder } from './types.js';

const dataDirectory = path.resolve(process.cwd(), '.data');
const runtimeFile = path.join(dataDirectory, 'runtime.json');
const sessionHours = Number(process.env.ACCESS_SESSION_HOURS || 24);
const requestLimit = Number(process.env.ACCESS_REQUEST_LIMIT || 500);
const workOrderLimit = Number(process.env.ACCESS_WORK_ORDER_LIMIT || 20);
let mutationQueue: Promise<unknown> = Promise.resolve();

function hashKey(rawKey: string) {
  return createHash('sha256').update(rawKey).digest('hex');
}

function emptyRuntime(): RuntimeData {
  return { workspaces: {}, accessSessions: {} };
}

function normalizeRuntime(value: Partial<RuntimeData> | undefined): RuntimeData {
  return { workspaces: value?.workspaces || {}, accessSessions: value?.accessSessions || {} };
}

async function readRuntime(): Promise<RuntimeData> {
  await mkdir(dataDirectory, { recursive: true });
  try {
    return normalizeRuntime(JSON.parse(await readFile(runtimeFile, 'utf8')) as RuntimeData);
  } catch {
    const initial = emptyRuntime();
    await writeFile(runtimeFile, JSON.stringify(initial, null, 2), 'utf8');
    return initial;
  }
}

async function writeRuntime(data: RuntimeData) {
  await writeFile(runtimeFile, JSON.stringify(data, null, 2), 'utf8');
}

function mutateRuntime<T>(mutation: (runtime: RuntimeData) => T | Promise<T>): Promise<T> {
  const operation = mutationQueue.then(async () => {
    const runtime = await readRuntime();
    const result = await mutation(runtime);
    await writeRuntime(runtime);
    return result;
  });
  mutationQueue = operation.catch(() => undefined);
  return operation;
}

function cleanExpired(runtime: RuntimeData) {
  const now = Date.now();
  for (const [keyHash, session] of Object.entries(runtime.accessSessions)) {
    if (Date.parse(session.expiresAt) <= now) {
      delete runtime.workspaces[session.workspaceId];
      delete runtime.accessSessions[keyHash];
    }
  }
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

export async function createAccessSession() {
  return mutateRuntime((runtime) => {
    cleanExpired(runtime);
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
    runtime.accessSessions[keyHash] = session;
    runtime.workspaces[workspaceId] = { workOrders: seedWorkOrders(workspaceId) };
    return { key: rawKey, ...publicSession(session) };
  });
}

export async function consumeAccessKey(rawKey: string) {
  return mutateRuntime((runtime) => {
    cleanExpired(runtime);
    const session = runtime.accessSessions[hashKey(rawKey)];
    if (!session) throw new Error('Nyckeln är ogiltig eller har löpt ut. Skapa en ny testnyckel.');
    if (session.requestsUsed >= session.requestLimit) throw new Error('Nyckelns anropskvot är förbrukad. Skapa en ny testnyckel.');
    session.requestsUsed += 1;
    return publicSession(session);
  });
}

export async function getWorkOrders(workspaceId: string) {
  const runtime = await readRuntime();
  return runtime.workspaces[workspaceId]?.workOrders || [];
}

export async function createWorkOrder(input: CreateWorkOrderInput, maximumOrders = workOrderLimit): Promise<WorkOrder> {
  return mutateRuntime((runtime) => {
    cleanExpired(runtime);
    const workspace = runtime.workspaces[input.workspaceId];
    if (!workspace) throw new Error('Testmiljön finns inte längre. Skapa en ny testnyckel.');
    if (workspace.workOrders.length >= maximumOrders) throw new Error(`Arbetsytan får innehålla högst ${maximumOrders} arbetsordrar.`);
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
    workspace.workOrders.unshift(order);
    return order;
  });
}

export async function resetWorkspace(workspaceId: string) {
  return mutateRuntime((runtime) => {
    if (!runtime.workspaces[workspaceId]) throw new Error('Testmiljön finns inte längre.');
    runtime.workspaces[workspaceId] = { workOrders: seedWorkOrders(workspaceId) };
    return runtime.workspaces[workspaceId];
  });
}

export async function cleanupExpiredSessions() {
  return mutateRuntime((runtime) => {
    const before = Object.keys(runtime.accessSessions).length;
    cleanExpired(runtime);
    return before - Object.keys(runtime.accessSessions).length;
  });
}
