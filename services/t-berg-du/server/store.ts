import * as azureStore from './azure-store.js';
import * as localStore from './local-store.js';

const selectedStore = process.env.STORAGE_BACKEND?.toLowerCase() === 'azure' ? azureStore : localStore;

export const getAssets = localStore.getAssets;
export const getAsset = localStore.getAsset;
export const getTechnicians = localStore.getTechnicians;
export const getFaultHistory = localStore.getFaultHistory;
export const findTechnicians = localStore.findTechnicians;

export const createAccessSession = selectedStore.createAccessSession;
export const consumeAccessKey = selectedStore.consumeAccessKey;
export const getWorkOrders = selectedStore.getWorkOrders;
export const createWorkOrder = selectedStore.createWorkOrder;
export const resetWorkspace = selectedStore.resetWorkspace;
export const cleanupExpiredSessions = selectedStore.cleanupExpiredSessions;
