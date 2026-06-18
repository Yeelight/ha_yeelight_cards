import { LitElement, css, html, type TemplateResult } from "lit";
import { definitionForType } from "./cards/definitions";
import { normalizeConfig } from "./config";
import { localize } from "./i18n";
import type { CardDefinition, HomeAssistant, YeelightCardConfig } from "./types";

type FormValue = Record<string, unknown>;
type FormSchema = Array<Record<string, unknown>>;

export class YeelightCardEditor extends LitElement {
  static override styles = css`
    :host{display:block}.editor{display:grid;gap:12px;color:var(--primary-text-color)}.title{display:flex;align-items:center;gap:10px;min-width:0;font-size:16px;font-weight:500;line-height:1.3}.title ha-icon{color:var(--primary-color);--mdc-icon-size:22px}.hint,.native-loading{color:var(--secondary-text-color);font-size:13px;line-height:1.5}ha-form{display:block}
  `;

  cardType?: string;
  private config?: YeelightCardConfig;
  private _hass?: HomeAssistant;

  override connectedCallback(): void {
    super.connectedCallback();
    loadHaComponents();
  }

  set hass(hass: HomeAssistant | undefined) {
    this._hass = hass;
    this.requestUpdate();
  }

  setConfig(config: unknown): void {
    this.config = normalizeConfig(config, this.cardType);
  }

  protected override render(): TemplateResult {
    const config = this.config;
    const definition = definitionForType(config?.type ?? this.cardType);
    if (!definition) {
      return html`<div class="editor"><div class="native-loading">${localize(this._hass, "editor.loading_native")}</div></div>`;
    }
    const normalized = config ?? normalizeConfig({ type: definition.type }, definition.type);

    return html`
      <div class="editor">
        <div class="title">
          <ha-icon .icon=${definition.icon}></ha-icon>
          <span>${localize(this._hass, definition.nameKey)}</span>
        </div>
        <div class="hint">${localize(this._hass, "editor.primary_helper")}</div>
        ${this.renderNativeForm(normalized, definition)}
      </div>
    `;
  }

  private renderNativeForm(config: YeelightCardConfig, definition: CardDefinition): TemplateResult {
    const schema: FormSchema = [
      { name: "entity", selector: { entity: { domain: definition.domains } } },
      { name: "name", selector: { entity_name: {} }, context: { entity: "entity" } },
      { type: "grid", name: "", schema: [{ name: "title", selector: { text: {} } }, { name: "theme", selector: { theme: {} } }, { name: "columns", selector: { number: { min: 1, mode: "box" } } }] },
      { name: "entities", selector: { entity: { domain: definition.domains, multiple: true } } },
      { type: "grid", name: "", schema: [{ name: "icon", selector: { icon: {} }, context: { icon_entity: "entity" } }, { name: "icon_height", selector: { text: { suffix: "px" } } }, { name: "color", selector: { ui_color: {} } }, selectField(this._hass, "icon_shape", ["circle", "square", "rounded"])] },
      { type: "grid", name: "", schema: [selectField(this._hass, "layout", ["default", "compact", "horizontal"]), selectField(this._hass, "content_layout", ["horizontal", "vertical"]), booleanField("vertical"), booleanField("fill_container")] },
      { type: "grid", name: "", schema: [selectField(this._hass, "primary_info", ["name", "state"]), selectField(this._hass, "secondary_info", ["state", "entity-id", "last-changed", "none"]), multiSelectField(this._hass, "state_content", ["state", "last-changed", "last-updated", "brightness", "color-temp", "effect"])] },
      { type: "grid", name: "", schema: [selectField(this._hass, "icon_type", ["icon", "entity-picture", "none"]), booleanField("show_entity_picture"), booleanField("show_name"), booleanField("show_icon"), booleanField("show_state"), booleanField("hide_state")] },
      { type: "grid", name: "", schema: [booleanField("show_controls"), booleanField("state_color"), selectField(this._hass, "appearance", ["default", "filled", "tonal", "plain"])] },
      actionField("tap_action", "more-info"),
      actionField("icon_tap_action", "more-info"),
      actionField("hold_action", "none"),
      actionField("icon_hold_action", "none"),
      actionField("double_tap_action", "none"),
      actionField("icon_double_tap_action", "none")
    ];
    const fields: Array<keyof YeelightCardConfig> = ["entity", "entities", "title", "name", "icon", "icon_height", "color", "theme", "columns", "icon_shape", "layout", "content_layout", "vertical", "fill_container", "primary_info", "secondary_info", "state_content", "icon_type", "show_entity_picture", "show_name", "show_icon", "show_state", "hide_state", "show_controls", "state_color", "appearance", "tap_action", "icon_tap_action", "hold_action", "icon_hold_action", "double_tap_action", "icon_double_tap_action"];
    return this.renderHaForm(pickData(config, fields), schema, (event) => this.patchConfig(cleanPatch(event.detail.value as Partial<YeelightCardConfig>)), (schemaItem) => localize(this._hass, `editor.${schemaItem.name}`), (schemaItem) => {
      if (schemaItem.name === "entity") return localize(this._hass, "editor.entity_helper");
      if (schemaItem.name === "entities") return localize(this._hass, "editor.entities_helper");
      if (schemaItem.name === "name") return localize(this._hass, "editor.name_helper");
      return "";
    });
  }

  private renderHaForm(data: FormValue, schema: FormSchema, onChange: (event: CustomEvent) => void, computeLabel: (schema: Record<string, unknown>) => string, computeHelper: (schema: Record<string, unknown>) => string = () => ""): TemplateResult {
    if (customElements.get("ha-form")) {
      return html`<ha-form .hass=${this._hass} .data=${data} .schema=${schema} .computeLabel=${computeLabel} .computeHelper=${computeHelper} @value-changed=${onChange}></ha-form>`;
    }
    return html`<div class="native-loading">${localize(this._hass, "editor.loading_native")}</div>`;
  }

  private patchConfig(patch: Partial<YeelightCardConfig>): void {
    const next = { ...this.config, type: this.config?.type ?? this.cardType, ...patch };
    this.config = normalizeConfig(next, this.cardType);
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this.config }, bubbles: true, composed: true }));
  }
}

function pickData(config: YeelightCardConfig, keys: Array<keyof YeelightCardConfig>): FormValue {
  return Object.fromEntries(keys.map((key) => [key, config[key]]).filter(([, item]) => item !== undefined));
}

function booleanField(name: string): Record<string, unknown> {
  return { name, selector: { boolean: {} } };
}

function actionField(name: string, defaultAction: string): Record<string, unknown> {
  return {
    name,
    selector: {
      ui_action: {
        actions: ["more-info", "toggle", "call-service", "navigate", "url", "none"],
        default_action: defaultAction
      }
    }
  };
}

function selectField(hass: HomeAssistant | undefined, name: string, values: string[]): Record<string, unknown> {
  return {
    name,
    selector: {
      select: {
        mode: "dropdown",
        options: values.map((value) => ({ value, label: localize(hass, `option.${value}`) }))
      }
    }
  };
}

function multiSelectField(hass: HomeAssistant | undefined, name: string, values: string[]): Record<string, unknown> {
  return {
    name,
    selector: {
      select: {
        multiple: true,
        mode: "dropdown",
        options: values.map((value) => ({ value, label: localize(hass, `option.${value}`) }))
      }
    }
  };
}

function cleanPatch(patch: Partial<YeelightCardConfig>): Partial<YeelightCardConfig> {
  return Object.fromEntries(Object.entries(patch).map(([key, item]) => [key, item === "" ? undefined : item])) as Partial<YeelightCardConfig>;
}

function loadHaComponents(): void {
  if (!customElements.get("ha-form")) {
    (customElements.get("hui-tile-card") as { getConfigElement?: () => unknown } | undefined)?.getConfigElement?.();
  }
}
