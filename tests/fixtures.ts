import type { HassEntity, HomeAssistant } from "../src/types";
import type { DeviceRegistryEntry, EntityRegistryEntry } from "../src/registry";

export function entity(entity_id: string, state = "off", attributes: Record<string, unknown> = {}): HassEntity {
  return { entity_id, state, attributes: { friendly_name: entity_id, ...attributes }, last_changed: "2026-06-17T00:00:00Z" };
}

export function hass(states: Record<string, HassEntity>, calls: Array<Record<string, unknown>> = [], registry: RegistryFixture = registryFixture(Object.keys(states))): HomeAssistant {
  return {
    states,
    connected: true,
    locale: { language: "zh-Hans" },
    callService: async (domain, service, data) => {
      calls.push({ domain, service, data });
    },
    callWS: async <T = unknown>(message: Record<string, unknown>) => registryResponse<T>(registry, message)
  };
}

export type RegistryFixture = {
  entities: EntityRegistryEntry[];
  devices?: DeviceRegistryEntry[];
};

export function registryFixture(entityIds: string[], platform = "yeelight_pro"): RegistryFixture {
  return {
    entities: entityIds.map((entity_id) => ({ entity_id, platform }))
  };
}

function registryResponse<T>(registry: RegistryFixture, message: Record<string, unknown>): T {
  const type = message.type;
  if (type === "entity_registry/list" || type === "config/entity_registry/list") {
    return registry.entities as T;
  }
  if (type === "device_registry/list" || type === "config/device_registry/list") {
    return (registry.devices ?? []) as T;
  }
  return [] as T;
}
