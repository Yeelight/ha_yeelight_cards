export type CardKind = "light" | "room" | "scene" | "strip" | "health" | "channel" | "panel" | "device";

export type LovelaceActionName = "more-info" | "toggle" | "call-service" | "navigate" | "url" | "none";
export type LovelaceActionTrigger = "tap" | "icon_tap" | "hold" | "icon_hold" | "double_tap" | "icon_double_tap";

export type LovelaceActionConfig = {
  action?: LovelaceActionName;
  service?: string;
  service_data?: Record<string, unknown>;
  target?: Record<string, unknown>;
  navigation_path?: string;
  url_path?: string;
  confirmation?: boolean | { text?: string };
};

export type YeelightCardConfig = {
  type: string;
  entity?: string;
  entities?: Array<string | { entity: string; name?: string }>;
  title?: string;
  name?: string;
  icon?: string;
  icon_height?: string;
  color?: string;
  theme?: string;
  columns?: number;
  layout: "default" | "compact" | "horizontal";
  content_layout: "horizontal" | "vertical";
  appearance: "default" | "filled" | "tonal" | "plain";
  primary_info: "name" | "state";
  secondary_info: "state" | "entity-id" | "last-changed" | "none";
  state_content?: string[];
  icon_type: "icon" | "entity-picture" | "none";
  icon_shape: "circle" | "square" | "rounded";
  show_entity_picture: boolean;
  show_name: boolean;
  show_icon: boolean;
  show_state: boolean;
  hide_state: boolean;
  show_controls: boolean;
  state_color: boolean;
  fill_container: boolean;
  vertical: boolean;
  grid_options?: Record<string, unknown>;
  tap_action?: LovelaceActionConfig;
  icon_tap_action?: LovelaceActionConfig;
  hold_action?: LovelaceActionConfig;
  icon_hold_action?: LovelaceActionConfig;
  double_tap_action?: LovelaceActionConfig;
  icon_double_tap_action?: LovelaceActionConfig;
};

export type HassEntity = {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
  last_changed?: string;
  last_updated?: string;
};

export type HomeAssistant = {
  states: Record<string, HassEntity>;
  connected?: boolean;
  locale?: { language?: string };
  callService: (domain: string, service: string, data?: Record<string, unknown>) => Promise<unknown>;
  callWS?: <T = unknown>(message: Record<string, unknown>) => Promise<T>;
};

export type EntityRegistryEntry = {
  entity_id: string;
  platform?: string;
  device_id?: string | null;
  unique_id?: string;
  disabled_by?: string | null;
  hidden_by?: string | null;
  original_name?: string | null;
};

export type CardDefinition = {
  kind: CardKind;
  tag: string;
  type: string;
  name: string;
  nameKey: string;
  description: string;
  descriptionKey: string;
  icon: string;
  domains: string[];
  semantic: "light" | "room" | "scene" | "strip" | "health" | "channel" | "panel" | "device";
  label: string;
  labelKey: string;
};

export type NormalizedEntity = {
  entityId: string;
  domain: string;
  state: string;
  name: string;
  icon: string;
  available: boolean;
  readOnly: boolean;
  attributes: Record<string, unknown>;
  lastChanged?: string;
};

declare global {
  interface Window {
    customCards?: Array<Record<string, unknown>>;
    loadCardHelpers?: () => Promise<{ createCardElement: (config: Record<string, unknown>) => HTMLElement }>;
  }
}
