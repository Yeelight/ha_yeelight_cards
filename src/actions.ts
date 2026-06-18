import { domainOf, normalizeEntity, numberAttr } from "./entity";
import type { HomeAssistant, LovelaceActionConfig, LovelaceActionTrigger, NormalizedEntity, YeelightCardConfig } from "./types";

const TOGGLE_DOMAINS = new Set(["light", "switch", "fan"]);

export function fireMoreInfo(host: HTMLElement, entityId: string): void {
  host.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId }, bubbles: true, composed: true }));
}

export async function runLovelaceAction(host: HTMLElement, hass: HomeAssistant | undefined, config: YeelightCardConfig, entity: NormalizedEntity, trigger: LovelaceActionTrigger): Promise<void> {
  const actionConfig = actionFor(config, trigger);
  const action = actionConfig?.action ?? (trigger === "tap" || trigger.startsWith("icon_") ? "more-info" : "none");
  if (actionConfig?.confirmation && !confirmAction(actionConfig)) {
    return;
  }
  if (action === "more-info") {
    fireMoreInfo(host, entity.entityId);
    return;
  }
  if (action === "toggle") {
    await toggleEntity(hass, entity.entityId);
    return;
  }
  if (action === "call-service") {
    if (!actionConfig) {
      throw new Error("call-service action requires configuration.");
    }
    await callConfiguredService(hass, actionConfig);
    return;
  }
  if (action === "navigate" && actionConfig?.navigation_path) {
    history.pushState(null, "", actionConfig.navigation_path);
    window.dispatchEvent(new CustomEvent("location-changed"));
    return;
  }
  if (action === "url" && actionConfig?.url_path) {
    window.open(actionConfig.url_path, "_blank", "noopener");
  }
}

export async function executeDomainAction(hass: HomeAssistant | undefined, entityId: string, action: string, value?: string | number): Promise<void> {
  const entity = ensureWritable(hass, entityId);
  switch (action) {
    case "turn_on":
    case "turn_off":
      assertDomain(entity, ["light", "switch", "fan"]);
      return call(hass, entity.domain, action, entity.entityId);
    case "brightness":
      assertDomain(entity, ["light"]);
      return call(hass, "light", "turn_on", entity.entityId, { brightness_pct: Number(value) });
    case "effect":
      assertDomain(entity, ["light"]);
      return call(hass, "light", "turn_on", entity.entityId, { effect: String(value) });
    case "open":
      assertDomain(entity, ["cover"]);
      return call(hass, "cover", "open_cover", entity.entityId);
    case "close":
      assertDomain(entity, ["cover"]);
      return call(hass, "cover", "close_cover", entity.entityId);
    case "temperature":
      assertDomain(entity, ["climate"]);
      return call(hass, "climate", "set_temperature", entity.entityId, { temperature: Number(value) });
    case "hvac_mode":
      assertDomain(entity, ["climate"]);
      return call(hass, "climate", "set_hvac_mode", entity.entityId, { hvac_mode: String(value) });
    case "fan_mode":
      assertDomain(entity, ["climate"]);
      return call(hass, "climate", "set_fan_mode", entity.entityId, { fan_mode: String(value) });
    case "percentage":
      assertDomain(entity, ["fan"]);
      return call(hass, "fan", "set_percentage", entity.entityId, { percentage: Number(value) });
    case "press":
      assertDomain(entity, ["button"]);
      return call(hass, "button", "press", entity.entityId);
    case "option":
      assertDomain(entity, ["select"]);
      return call(hass, "select", "select_option", entity.entityId, { option: String(value) });
    case "scene":
      assertDomain(entity, ["scene"]);
      return call(hass, "scene", "turn_on", entity.entityId);
    case "number":
      assertDomain(entity, ["number"]);
      return call(hass, "number", "set_value", entity.entityId, { value: clampNumber(entity, Number(value)) });
    default:
      throw new Error(`Unsupported action: ${action}`);
  }
}

async function toggleEntity(hass: HomeAssistant | undefined, entityId: string): Promise<void> {
  const entity = ensureWritable(hass, entityId);
  if (!TOGGLE_DOMAINS.has(entity.domain)) {
    throw new Error(`Toggle is not supported for ${entity.domain}.`);
  }
  return call(hass, entity.domain, entity.state === "on" ? "turn_off" : "turn_on", entity.entityId);
}

function actionFor(config: YeelightCardConfig, trigger: LovelaceActionTrigger): LovelaceActionConfig | undefined {
  if (trigger === "tap") return config.tap_action;
  if (trigger === "icon_tap") return config.icon_tap_action;
  if (trigger === "icon_hold") return config.icon_hold_action;
  if (trigger === "icon_double_tap") return config.icon_double_tap_action;
  return trigger === "hold" ? config.hold_action : config.double_tap_action;
}

function confirmAction(actionConfig: LovelaceActionConfig): boolean {
  const text = typeof actionConfig.confirmation === "object" ? actionConfig.confirmation.text : "Are you sure?";
  return window.confirm(text || "Are you sure?");
}

async function callConfiguredService(hass: HomeAssistant | undefined, actionConfig: LovelaceActionConfig): Promise<void> {
  if (!hass || hass.connected === false) {
    throw new Error("Home Assistant is not connected.");
  }
  const [domain, service] = String(actionConfig.service ?? "").split(".");
  if (!domain || !service) {
    throw new Error("call-service action requires service: domain.service.");
  }
  const data = record(actionConfig.service_data);
  const target = record(actionConfig.target);
  const entityId = singleEntity(data.entity_id ?? target.entity_id);
  if (!entityId) {
    throw new Error("call-service action requires one entity_id.");
  }
  ensureWritable(hass, entityId);
  await hass.callService(domain, service, { ...data, ...target, entity_id: entityId });
}

function ensureWritable(hass: HomeAssistant | undefined, entityId: string): NormalizedEntity {
  if (!hass || hass.connected === false) {
    throw new Error("Home Assistant is not connected.");
  }
  const entity = normalizeEntity(hass, entityId);
  if (!entity || !entity.available || entity.readOnly) {
    throw new Error("Entity is not available for write actions.");
  }
  return entity;
}

function assertDomain(entity: NormalizedEntity, allowed: string[]): void {
  if (!allowed.includes(entity.domain)) {
    throw new Error(`${entity.entityId} cannot run this action.`);
  }
}

async function call(hass: HomeAssistant | undefined, domain: string, service: string, entityId: string, data: Record<string, unknown> = {}): Promise<void> {
  await hass?.callService(domain, service, { entity_id: entityId, ...data });
}

function clampNumber(entity: NormalizedEntity, value: number): number {
  const min = numberAttr(entity.attributes, "min") ?? Number.NEGATIVE_INFINITY;
  const max = numberAttr(entity.attributes, "max") ?? Number.POSITIVE_INFINITY;
  const step = numberAttr(entity.attributes, "step") ?? 1;
  return Math.min(max, Math.max(min, Math.round(value / step) * step));
}

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function singleEntity(value: unknown): string | undefined {
  return typeof value === "string" && domainOf(value) ? value : undefined;
}
