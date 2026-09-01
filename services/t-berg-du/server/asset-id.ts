export const ASSET_ID_PATTERN = /^LO-[A-Z]{2}-[0-9]{3}$/;
export const ASSET_ID_INPUT_PATTERN = /^LO-[A-Z]{2}-[0-9]{3}$/i;

export function normalizeAssetId(assetId: string) {
  return assetId.trim().toUpperCase();
}
