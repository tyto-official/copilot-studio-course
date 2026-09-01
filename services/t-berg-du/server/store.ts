import * as azureStore from './azure-store.js';
import * as localStore from './local-store.js';
import { buildTechnicianAvailability, findAvailableTechnicians } from './technician-availability.js';

const selectedStore = process.env.STORAGE_BACKEND?.toLowerCase() === 'azure' ? azureStore : localStore;

export const getAssets = localStore.getAssets;
export const getAsset = localStore.getAsset;
export const getFaultHistory = localStore.getFaultHistory;
export const getSpareParts = localStore.getSpareParts;

export const createAccessSession = selectedStore.createAccessSession;
export const consumeAccessKey = selectedStore.consumeAccessKey;
export const getWorkOrders = selectedStore.getWorkOrders;
export const createWorkOrder = selectedStore.createWorkOrder;
export const resetWorkspace = selectedStore.resetWorkspace;
export const cleanupExpiredSessions = selectedStore.cleanupExpiredSessions;

export async function getTechnicians(workspaceId: string) {
  return buildTechnicianAvailability(await selectedStore.getWorkOrders(workspaceId));
}

export async function findTechnicians(workspaceId: string, requiredSkill: string) {
  return findAvailableTechnicians(requiredSkill, await selectedStore.getWorkOrders(workspaceId));
}
