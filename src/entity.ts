import type { HassEntity, HomeAssistant, NormalizedEntity } from "./types";
import { localize, stateText } from "./i18n";

const READ_ONLY_DOMAINS = new Set(["sensor", "binary_sensor", "event"]);
const ACTION_DOMAINS = new Set(["button", "scene"]);

export function domainOf(entityId: string): string {
  return entityId.split(".", 1)[0] ?? "";
}

export function normalizeEntity(hass: HomeAssistant | undefined, entityId: string | undefined): NormalizedEntity | undefined {
  if (!hass || !entityId) {
    return undefined;
  }
  const stateObj = hass.states?.[entityId];
  if (!stateObj) {
    return undefined;
  }
  const domain = domainOf(entityId);
  return {
    entityId,
    domain,
    state: stateObj.state,
    name: friendlyName(stateObj),
    icon: iconFor(stateObj, domain),
    available: hass.connected !== false && stateObj.state !== "unavailable" && (stateObj.state !== "unknown" || ACTION_DOMAINS.has(domain)),
    readOnly: READ_ONLY_DOMAINS.has(domain),
    attributes: stateObj.attributes ?? {},
    lastChanged: stateObj.last_changed
  };
}

export function findEntity(hass: HomeAssistant | undefined, domains: string[]): string | undefined {
  if (!hass?.states) {
    return undefined;
  }
  return Object.keys(hass.states)
    .filter((entityId) => domains.includes(domainOf(entityId)))
    .sort((left, right) => entityRank(hass.states[right]) - entityRank(hass.states[left]) || left.localeCompare(right))
    .at(0);
}

export function isYeelightLike(entity: NormalizedEntity | undefined): boolean {
  if (!entity) {
    return false;
  }
  const haystack = `${entity.entityId} ${entity.name} ${String(entity.attributes.manufacturer ?? "")} ${String(entity.attributes.model ?? "")}`.toLowerCase();
  return haystack.includes("yeelight") || haystack.includes("易来");
}

export function isYeelightCandidate(stateObj: HassEntity | undefined): boolean {
  if (!stateObj) {
    return false;
  }
  const attrs = stateObj.attributes ?? {};
  const haystack = `${stateObj.entity_id} ${String(attrs.friendly_name ?? "")} ${String(attrs.manufacturer ?? "")} ${String(attrs.model ?? "")} ${String(attrs.device_class ?? "")}`.toLowerCase();
  return haystack.includes("yeelight") || haystack.includes("易来") || haystack.includes("yeelink");
}

export function stateLabel(entity: NormalizedEntity, hass?: HomeAssistant): string {
  if (ACTION_DOMAINS.has(entity.domain) && entity.state === "unknown") {
    return localize(hass, "state.action");
  }
  const unit = stringAttr(entity.attributes, "unit_of_measurement");
  if (unit) {
    return `${entity.state} ${unit}`;
  }
  return stateText(hass, entity.state);
}

export function numberAttr(attrs: Record<string, unknown>, key: string): number | undefined {
  const value = attrs[key];
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

export function stringArrayAttr(attrs: Record<string, unknown>, key: string): string[] {
  const value = attrs[key];
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function entityRank(stateObj: HassEntity): number {
  const available = stateObj.state !== "unavailable" && stateObj.state !== "unknown" ? 10 : 0;
  const name = `${stateObj.entity_id} ${stateObj.attributes?.friendly_name ?? ""}`.toLowerCase();
  return available + (name.includes("yeelight") || name.includes("易来") ? 1 : 0);
}

function friendlyName(stateObj: HassEntity): string {
  return typeof stateObj.attributes?.friendly_name === "string" && stateObj.attributes.friendly_name.trim() ? stateObj.attributes.friendly_name : stateObj.entity_id;
}

function iconFor(stateObj: HassEntity, domain: string): string {
  if (typeof stateObj.attributes?.icon === "string" && stateObj.attributes.icon) {
    return stateObj.attributes.icon;
  }
  return (
    {
      light: "mdi:lightbulb",
      switch: "mdi:toggle-switch",
      cover: "mdi:curtains",
      climate: "mdi:thermostat",
      fan: "mdi:fan",
      sensor: "mdi:gauge",
      binary_sensor: "mdi:checkbox-marked-circle-outline",
      event: "mdi:calendar-alert",
      scene: "mdi:movie-open-play",
      button: "mdi:button-pointer",
      select: "mdi:form-dropdown",
      number: "mdi:numeric"
    }[domain] ?? "mdi:devices"
  );
}

function stringAttr(attrs: Record<string, unknown>, key: string): string | undefined {
  const value = attrs[key];
  return typeof value === "string" && value ? value : undefined;
}
