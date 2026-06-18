import { definitionForType, normalizeCardType } from "./cards/definitions";
import type { YeelightCardConfig } from "./types";

const DEFAULTS: Omit<YeelightCardConfig, "type"> = {
  layout: "default",
  content_layout: "horizontal",
  appearance: "default",
  primary_info: "name",
  secondary_info: "state",
  icon_type: "icon",
  icon_shape: "circle",
  show_entity_picture: false,
  show_name: true,
  show_icon: true,
  show_state: true,
  hide_state: false,
  show_controls: true,
  state_color: false,
  fill_container: false,
  vertical: false
};

export function normalizeConfig(raw: unknown, fallbackType?: string): YeelightCardConfig {
  if (!raw || typeof raw !== "object") {
    throw new Error("Card config must be an object.");
  }
  const input = raw as Record<string, unknown>;
  const type = normalizeCardType(typeof input.type === "string" ? input.type : fallbackType);
  const definition = definitionForType(type);
  if (!definition) {
    throw new Error(`Unsupported Yeelight card type: ${type || "(missing)"}.`);
  }
  return {
    ...DEFAULTS,
    type: definition.type,
    entity: stringOrUndefined(input.entity),
    entities: normalizeEntities(input.entities),
    title: stringOrUndefined(input.title),
    name: stringOrUndefined(input.name),
    icon: stringOrUndefined(input.icon),
    icon_height: stringOrUndefined(input.icon_height),
    color: stringOrUndefined(input.color),
    theme: stringOrUndefined(input.theme),
    columns: positiveNumber(input.columns),
    layout: pick(input.layout, ["default", "compact", "horizontal"], DEFAULTS.layout),
    content_layout: pick(input.content_layout, ["horizontal", "vertical"], DEFAULTS.content_layout),
    appearance: pick(input.appearance, ["default", "filled", "tonal", "plain"], DEFAULTS.appearance),
    primary_info: pick(input.primary_info, ["name", "state"], DEFAULTS.primary_info),
    secondary_info: pick(input.secondary_info, ["state", "entity-id", "last-changed", "none"], DEFAULTS.secondary_info),
    state_content: stringArray(input.state_content),
    icon_type: pick(input.icon_type, ["icon", "entity-picture", "none"], DEFAULTS.icon_type),
    icon_shape: pick(input.icon_shape, ["circle", "square", "rounded"], DEFAULTS.icon_shape),
    show_entity_picture: bool(input.show_entity_picture, DEFAULTS.show_entity_picture),
    show_name: bool(input.show_name, DEFAULTS.show_name),
    show_icon: bool(input.show_icon, DEFAULTS.show_icon),
    show_state: bool(input.show_state, DEFAULTS.show_state),
    hide_state: bool(input.hide_state, DEFAULTS.hide_state),
    show_controls: bool(input.show_controls, DEFAULTS.show_controls),
    state_color: bool(input.state_color, DEFAULTS.state_color),
    fill_container: bool(input.fill_container, DEFAULTS.fill_container),
    vertical: bool(input.vertical, DEFAULTS.vertical),
    grid_options: objectOrUndefined(input.grid_options),
    tap_action: action(input.tap_action),
    icon_tap_action: action(input.icon_tap_action),
    hold_action: action(input.hold_action),
    icon_hold_action: action(input.icon_hold_action),
    double_tap_action: action(input.double_tap_action),
    icon_double_tap_action: action(input.icon_double_tap_action)
  };
}

export function stubConfig(type: string, entity?: string): Record<string, unknown> {
  const normalized = normalizeCardType(type);
  return entity ? { type: normalized, entity } : { type: normalized };
}

function stringOrUndefined(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function bool(value: unknown, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function positiveNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : undefined;
}

function pick<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  return typeof value === "string" && allowed.includes(value as T) ? (value as T) : fallback;
}

function action(value: unknown): YeelightCardConfig["tap_action"] {
  return value && typeof value === "object" ? (value as YeelightCardConfig["tap_action"]) : undefined;
}

function objectOrUndefined(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === "object" && !Array.isArray(value) ? { ...(value as Record<string, unknown>) } : undefined;
}

function stringArray(value: unknown): string[] | undefined {
  if (typeof value === "string" && value.trim()) {
    return [value.trim()];
  }
  if (!Array.isArray(value)) {
    return undefined;
  }
  const items = value.filter((item): item is string => typeof item === "string" && Boolean(item.trim())).map((item) => item.trim());
  return items.length ? items : undefined;
}

function normalizeEntities(value: unknown): YeelightCardConfig["entities"] {
  if (!Array.isArray(value)) {
    return undefined;
  }
  const entities = value
    .map((item) => {
      if (typeof item === "string" && item.trim()) {
        return item.trim();
      }
      if (item && typeof item === "object") {
        const entity = stringOrUndefined((item as Record<string, unknown>).entity);
        if (entity) {
          const name = stringOrUndefined((item as Record<string, unknown>).name);
          return name ? { entity, name } : { entity };
        }
      }
      return undefined;
    })
    .filter((item): item is NonNullable<YeelightCardConfig["entities"]>[number] => Boolean(item));
  return entities.length ? entities : undefined;
}
