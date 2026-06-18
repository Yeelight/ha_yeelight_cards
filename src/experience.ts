import { localize } from "./i18n";
import { stateLabel, stringArrayAttr } from "./entity";
import type { CardKind, HomeAssistant, NormalizedEntity } from "./types";

export function healthLabel(hass: HomeAssistant | undefined, entity: NormalizedEntity): string {
  const text = entityText(entity);
  if (/firmware|固件/.test(text)) return localize(hass, "health.firmware");
  if (/lan|局域网/.test(text)) return localize(hass, "health.lan");
  if (/gateway|网关/.test(text)) return localize(hass, "health.gateway");
  if (/cloud|云/.test(text)) return localize(hass, "health.cloud");
  if (/online|在线/.test(text)) return localize(hass, "health.online");
  return entity.name;
}

export function experienceLabel(hass: HomeAssistant | undefined, entity: NormalizedEntity): string {
  const text = entityText(entity);
  if (entity.domain === "light" && /ambient|氛围|辅光|背光/.test(text)) return localize(hass, "experience.ambient");
  if (entity.domain === "light" && /night|夜灯|起夜/.test(text)) return localize(hass, "experience.night");
  if (entity.domain === "light" && /strip|led|灯带|彩光|gradient|flow/.test(text)) return localize(hass, "experience.strip");
  if (entity.domain === "light") return localize(hass, "experience.main_light");
  if (entity.domain === "switch") return /relay|继电器|开关/.test(text) ? localize(hass, "experience.relay") : entity.name;
  if (entity.domain === "select") return /scene|mode|effect|场景|模式|效果|律动|节律/.test(text) ? localize(hass, "experience.mode") : entity.name;
  if (entity.domain === "button" || entity.domain === "scene") return localize(hass, "experience.scene");
  if (entity.domain === "number") return /duration|time|delay|speed|时长|延时|速度|渐变/.test(text) ? localize(hass, "experience.effect_param") : entity.name;
  if (entity.domain === "sensor" || entity.domain === "binary_sensor") return healthLabel(hass, entity);
  return entity.name;
}

export function supportsRelatedKind(kind: CardKind, entity: NormalizedEntity): boolean {
  if (isLowSignalUnknown(entity)) {
    return false;
  }
  if (kind === "health") {
    return ["sensor", "binary_sensor", "update"].includes(entity.domain) || isDiagnosticSwitch(entity);
  }
  if (kind === "scene" || kind === "panel") {
    return isSceneEntity(entity) || isModeEntity(entity) || isEffectParameter(entity);
  }
  if (kind === "strip") {
    return isStripEntity(entity) || isModeEntity(entity) || isEffectParameter(entity);
  }
  if (kind === "channel" || kind === "room" || kind === "device") {
    return isLightingLayer(entity) || isRelayEntity(entity) || isUsefulSensor(entity);
  }
  return true;
}

export function relatedRank(kind: CardKind, entity: NormalizedEntity): number {
  const text = entityText(entity);
  if (kind === "health") {
    if (/online|在线|lan|局域网|gateway|网关|cloud|云/.test(text)) return 0;
    if (/firmware|固件|update/.test(text)) return 1;
    return entity.readOnly ? 2 : 3;
  }
  if (kind === "scene" || kind === "panel") {
    if (["scene", "button"].includes(entity.domain)) return 0;
    if (entity.domain === "select") return 1;
    return 2;
  }
  if (kind === "strip") {
    if (/strip|led|灯带|彩光|gradient|flow/.test(text)) return 0;
    if (entity.domain === "select") return 1;
    if (entity.domain === "number") return 2;
    return 3;
  }
  if (entity.domain === "light" && /ambient|氛围|night|夜灯|strip|灯带/.test(text)) return 0;
  if (entity.domain === "switch") return 1;
  if (entity.domain === "select" || entity.domain === "scene" || entity.domain === "button") return 2;
  if (entity.domain === "number") return 3;
  return 4;
}

export function tileStateLabel(entity: NormalizedEntity, hass: HomeAssistant | undefined): string {
  if (entity.domain === "scene" || entity.domain === "button") {
    return localize(hass, "state.action");
  }
  return stateLabel(entity, hass);
}

function isLowSignalUnknown(entity: NormalizedEntity): boolean {
  return entity.state === "unknown" && !["button", "scene"].includes(entity.domain) && !stringArrayAttr(entity.attributes, "options").length;
}

function isLightingLayer(entity: NormalizedEntity): boolean {
  return entity.domain === "light";
}

function isRelayEntity(entity: NormalizedEntity): boolean {
  return entity.domain === "switch" && /relay|继电器|双路|开关/.test(entityText(entity));
}

function isUsefulSensor(entity: NormalizedEntity): boolean {
  return ["sensor", "binary_sensor", "update"].includes(entity.domain) && /lux|照度|luminance|brightness|功率|power|energy|电量|online|在线|lan|局域网|firmware|固件|gateway|网关|cloud|云/.test(entityText(entity));
}

function isDiagnosticSwitch(entity: NormalizedEntity): boolean {
  return entity.domain === "switch" && /lan|局域网|gateway|网关|cloud|云|online|在线/.test(entityText(entity));
}

function isSceneEntity(entity: NormalizedEntity): boolean {
  const text = entityText(entity);
  return ["scene", "button"].includes(entity.domain) || (entity.domain === "switch" && /scene|场景|movie|观影|sleep|睡眠|night|起夜|rhythm|律动|节律/.test(text));
}

function isModeEntity(entity: NormalizedEntity): boolean {
  return entity.domain === "select" && /scene|mode|effect|场景|模式|效果|律动|节律|music|音乐/.test(entityText(entity));
}

function isEffectParameter(entity: NormalizedEntity): boolean {
  return entity.domain === "number" && /duration|time|delay|speed|brightness|时长|延时|速度|渐变|亮度/.test(entityText(entity));
}

function isStripEntity(entity: NormalizedEntity): boolean {
  return entity.domain === "light" && /strip|led|灯带|彩光|gradient|flow|渐变|流光/.test(entityText(entity));
}

function entityText(entity: NormalizedEntity): string {
  return `${entity.entityId} ${entity.name} ${String(entity.attributes.device_class ?? "")}`.toLowerCase();
}
