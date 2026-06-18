import type { CardDefinition, CardKind } from "../types";
import { cardKey, localizeStatic } from "../i18n";

function define(kind: CardKind, tag: string, icon: string, domains: string[]): CardDefinition {
  return {
    kind,
    tag,
    type: `custom:${tag}`,
    name: localizeStatic(cardKey(kind, "name")),
    nameKey: cardKey(kind, "name"),
    description: localizeStatic(cardKey(kind, "description")),
    descriptionKey: cardKey(kind, "description"),
    icon,
    domains,
    semantic: kind,
    label: localizeStatic(cardKey(kind, "label")),
    labelKey: cardKey(kind, "label")
  };
}

export const CARD_DEFINITIONS: CardDefinition[] = [
  define("light", "yeelight-light-card", "mdi:lightbulb", ["light"]),
  define("room", "yeelight-room-card", "mdi:home-lightbulb", ["light", "group", "switch"]),
  define("scene", "yeelight-scene-card", "mdi:movie-open-play", ["scene", "button", "select"]),
  define("strip", "yeelight-strip-card", "mdi:led-strip-variant", ["light", "select", "number", "sensor"]),
  define("health", "yeelight-health-card", "mdi:heart-pulse", ["sensor", "binary_sensor", "switch", "update"]),
  define("channel", "yeelight-channel-card", "mdi:lightbulb-group", ["light", "switch", "number", "select", "sensor"]),
  define("panel", "yeelight-panel-card", "mdi:gesture-tap-button", ["light", "button", "select", "number", "sensor", "switch"]),
  define("device", "yeelight-device-card", "mdi:devices", ["light", "switch", "sensor", "binary_sensor", "event", "button", "select", "number", "scene", "update"])
];

export const CARD_BY_KIND = Object.fromEntries(CARD_DEFINITIONS.map((definition) => [definition.kind, definition])) as Record<CardKind, CardDefinition>;

export function definitionForType(type: string | undefined): CardDefinition | undefined {
  const normalized = normalizeCardType(type);
  return CARD_DEFINITIONS.find((definition) => definition.type === normalized || definition.tag === normalized);
}

export function normalizeCardType(type: string | undefined): string {
  const value = type?.trim();
  if (!value) {
    return "";
  }
  if (value.startsWith("custom:")) {
    return value;
  }
  if (value.endsWith("-card")) {
    return `custom:${value}`;
  }
  return `custom:yeelight-${value}-card`;
}
