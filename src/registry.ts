import type { HomeAssistant } from "./types";

const YEELIGHT_PRO_PLATFORMS = new Set(["yeelight_pro"]);

export type EntityRegistryEntry = {
  entity_id?: string;
  platform?: string | null;
  device_id?: string | null;
};

export type DeviceRegistryEntry = {
  id?: string;
  identifiers?: unknown;
};

export type RegistryIndex = {
  status: "ready" | "unavailable";
  entitySources: Map<string, "yeelight_pro" | "other">;
  entityDeviceIds: Map<string, string>;
};

const cache = new WeakMap<HomeAssistant, Promise<RegistryIndex>>();

export function loadRegistryIndex(hass: HomeAssistant | undefined): Promise<RegistryIndex> {
  if (!hass?.callWS) {
    return Promise.resolve(unavailableIndex());
  }
  const cached = cache.get(hass);
  if (cached) {
    return cached;
  }
  const pending = loadFromHass(hass).catch(() => unavailableIndex());
  cache.set(hass, pending);
  return pending;
}

export function isYeelightProEntity(index: RegistryIndex | undefined, entityId: string): boolean {
  return index?.status === "ready" && index.entitySources.get(entityId) === "yeelight_pro";
}

export function registryDeviceId(index: RegistryIndex | undefined, entityId: string | undefined): string | undefined {
  return entityId && index?.status === "ready" ? index.entityDeviceIds.get(entityId) : undefined;
}

export function registryEntitiesForDevice(index: RegistryIndex | undefined, deviceId: string | undefined): string[] {
  if (!deviceId || index?.status !== "ready") {
    return [];
  }
  return Array.from(index.entityDeviceIds.entries())
    .filter(([entityId, candidateDeviceId]) => candidateDeviceId === deviceId && isYeelightProEntity(index, entityId))
    .map(([entityId]) => entityId)
    .sort();
}

async function loadFromHass(hass: HomeAssistant): Promise<RegistryIndex> {
  const [entities, devices] = await Promise.all([loadRegistryList<EntityRegistryEntry>(hass, "entity_registry/list", "config/entity_registry/list"), loadRegistryList<DeviceRegistryEntry>(hass, "device_registry/list", "config/device_registry/list").catch(() => [])]);
  const yeelightDeviceIds = new Set(devices.filter(isYeelightProDevice).map((device) => device.id).filter((id): id is string => Boolean(id)));
  const entitySources = new Map<string, "yeelight_pro" | "other">();
  const entityDeviceIds = new Map<string, string>();
  for (const entity of entities) {
    const entityId = typeof entity.entity_id === "string" ? entity.entity_id : "";
    if (!entityId) {
      continue;
    }
    if (typeof entity.device_id === "string" && entity.device_id) {
      entityDeviceIds.set(entityId, entity.device_id);
    }
    entitySources.set(entityId, isYeelightProPlatform(entity.platform) || (typeof entity.device_id === "string" && yeelightDeviceIds.has(entity.device_id)) ? "yeelight_pro" : "other");
  }
  return { status: "ready", entitySources, entityDeviceIds };
}

async function loadRegistryList<T>(hass: HomeAssistant, primaryType: string, fallbackType: string): Promise<T[]> {
  try {
    return normalizeRegistryList<T>(await hass.callWS?.({ type: primaryType }));
  } catch (error) {
    return normalizeRegistryList<T>(await hass.callWS?.({ type: fallbackType }));
  }
}

function normalizeRegistryList<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function isYeelightProDevice(device: DeviceRegistryEntry): boolean {
  return normalizeIdentifiers(device.identifiers).some(([domain]) => isYeelightProPlatform(domain));
}

function normalizeIdentifiers(value: unknown): Array<[string, string]> {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map((item) => (Array.isArray(item) && typeof item[0] === "string" && typeof item[1] === "string" ? [item[0], item[1]] : undefined))
    .filter((item): item is [string, string] => Boolean(item));
}

function isYeelightProPlatform(value: unknown): boolean {
  return typeof value === "string" && YEELIGHT_PRO_PLATFORMS.has(value);
}

function unavailableIndex(): RegistryIndex {
  return { status: "unavailable", entitySources: new Map(), entityDeviceIds: new Map() };
}
