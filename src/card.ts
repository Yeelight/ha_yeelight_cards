import { LitElement, html, nothing, type TemplateResult } from "lit";
import { cardStyles } from "./styles";
import { executeDomainAction, runLovelaceAction } from "./actions";
import { CARD_BY_KIND } from "./cards/definitions";
import { normalizeConfig, stubConfig } from "./config";
import { domainText, localize } from "./i18n";
import { findEntity, normalizeEntity, numberAttr, stateLabel, stringArrayAttr } from "./entity";
import { experienceLabel, healthLabel, relatedRank, supportsRelatedKind, tileStateLabel } from "./experience";
import { createEditorElement } from "./editor-element";
import { gridOptions, iconStyle } from "./layout";
import { isYeelightProEntity, loadRegistryIndex, registryDeviceId, registryEntitiesForDevice, type RegistryIndex } from "./registry";
import type { CardDefinition, CardKind, HomeAssistant, NormalizedEntity, YeelightCardConfig } from "./types";

export function createCardClass(kind: CardKind): typeof YeelightBaseCard {
  const definition = CARD_BY_KIND[kind];
  return class extends YeelightBaseCard {
    static getConfigElement(): HTMLElement {
      return createEditorElement(definition);
    }

    static getStubConfig(hass?: HomeAssistant): Record<string, unknown> {
      return stubConfig(definition.type, findEntity(hass, definition.domains));
    }

    protected override definition = definition;
  };
}

export class YeelightBaseCard extends LitElement {
  static override styles = cardStyles;
  protected definition: CardDefinition = CARD_BY_KIND.device;
  protected config?: YeelightCardConfig;
  private error = "";
  private registryIndex?: RegistryIndex;
  private registryRequest = 0;
  private tapTimer?: number;

  setConfig(config: unknown): void {
    this.config = normalizeConfig(config, this.definition.type);
  }

  set hass(value: HomeAssistant | undefined) {
    this._hass = value;
    this.loadRegistry();
    this.requestUpdate();
  }

  get hass(): HomeAssistant | undefined {
    return this._hass;
  }

  private _hass?: HomeAssistant;

  override connectedCallback(): void {
    super.connectedCallback();
    this.loadRegistry();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.clearTapTimer();
  }

  getCardSize(): number {
    return this.definition.kind === "device" ? 3 : 2;
  }

  getGridOptions(): Record<string, number> {
    return gridOptions(this.definition.kind, this.config);
  }

  protected override render(): TemplateResult {
    const config = this.config;
    if (!config?.entity) {
      return html`<ha-card><div class="card"><div class="empty">${localize(this.hass, "empty.select_entity")}</div></div></ha-card>`;
    }
    const entity = normalizeEntity(this.hass, config.entity);
    if (!entity) {
      return html`<ha-card><div class="card"><div class="empty">${localize(this.hass, "empty.entity_unavailable", { entity: config.entity })}</div></div></ha-card>`;
    }
    const active = entity.state === "on" || entity.state === "open" || entity.domain === "scene";
    const classes = ["card", config.layout === "compact" ? "compact" : "", config.content_layout === "vertical" || config.vertical ? "vertical" : "", config.appearance].filter(Boolean).join(" ");
    return html`
      <ha-card .header=${config.title || nothing} .theme=${config.theme || nothing}>
        <div
          class=${classes}
          @click=${(event: MouseEvent) => this.onSurfaceClick(event, entity)}
          @dblclick=${(event: MouseEvent) => this.onSurfaceDoubleClick(event, entity)}
          @contextmenu=${(event: MouseEvent) => this.onSurfaceHold(event, entity)}
        >
          ${this.renderHeader(config, entity, active)}
          <div class="body">
            ${this.renderExperienceSummary(config, entity)}
            ${this.renderChips(config, entity)}
            ${config.show_controls ? this.renderControls(entity) : nothing}
            ${this.renderExperienceTiles(config, entity)}
          </div>
          ${this.error ? html`<div class="error" role="status">${this.error}</div>` : nothing}
        </div>
      </ha-card>
    `;
  }

  private renderHeader(config: YeelightCardConfig, entity: NormalizedEntity, active: boolean): TemplateResult {
    const title = config.name || (config.primary_info === "state" ? stateLabel(entity, this.hass) : entity.name);
    const subtitle = config.secondary_info === "entity-id" ? entity.entityId : config.secondary_info === "last-changed" ? entity.lastChanged ?? "" : config.secondary_info === "none" ? "" : stateLabel(entity, this.hass);
    return html`
      <div class="header">
        ${config.show_icon && config.icon_type !== "none"
          ? html`<button
              class=${`icon ${config.icon_shape} ${active && config.state_color ? "active" : ""}`}
              style=${iconStyle(config)}
              aria-label=${localize(this.hass, "a11y.more_info")}
              @click=${(event: Event) => this.onIconClick(event, entity)}
              @dblclick=${(event: MouseEvent) => this.onIconDoubleClick(event, entity)}
              @contextmenu=${(event: MouseEvent) => this.onIconHold(event, entity)}
            >
              ${this.renderIcon(config, entity)}
            </button>`
          : nothing}
        <div class=${config.show_name ? "" : "visually-hidden"}>
          ${config.show_name ? html`<div class="title">${title}</div>` : nothing}
          ${subtitle ? html`<div class="subtitle">${subtitle}</div>` : nothing}
        </div>
        ${config.show_state && !config.hide_state ? html`<div class="state">${stateLabel(entity, this.hass)}</div>` : nothing}
      </div>
    `;
  }

  private renderIcon(config: YeelightCardConfig, entity: NormalizedEntity): TemplateResult {
    const picture = typeof entity.attributes.entity_picture === "string" ? entity.attributes.entity_picture : "";
    if ((config.icon_type === "entity-picture" || config.show_entity_picture) && picture) {
      return html`<img class="entity-picture" alt="" src=${picture} />`;
    }
    return html`<ha-icon .icon=${config.icon || entity.icon}></ha-icon>`;
  }

  private renderChips(config: YeelightCardConfig, entity: NormalizedEntity): TemplateResult {
    const chips = [localize(this.hass, this.definition.labelKey), entity.available ? domainText(this.hass, entity.domain) : localize(this.hass, "state.unavailable")];
    if (isYeelightProEntity(this.registryIndex, entity.entityId)) {
      chips.push(localize(this.hass, "chip.yeelight"));
    }
    if (entity.readOnly) {
      chips.push(localize(this.hass, "chip.read_only"));
    }
    return html`<div class="chips">${chips.map((chip) => html`<span class="chip">${chip}</span>`)}</div>`;
  }

  private renderExperienceSummary(config: YeelightCardConfig, entity: NormalizedEntity): TemplateResult {
    if (this.definition.kind === "health") {
      const related = this.relatedEntities(config, entity);
      const unavailable = [entity, ...related].filter((item) => !item.available).length;
      return html`<div class="subtitle">${unavailable ? localize(this.hass, "summary.health.issue", { count: unavailable }) : localize(this.hass, "summary.health.ok")}</div>`;
    }
    if (this.definition.kind === "room") {
      const related = this.relatedEntities(config, entity);
      const lights = [entity, ...related].filter((item) => item.domain === "light");
      const active = lights.filter((item) => item.state === "on").length;
      return html`<div class="subtitle">${localize(this.hass, "summary.room.layers", { active, total: lights.length || 1 })}</div>`;
    }
    if (this.definition.kind === "channel") {
      return html`<div class="subtitle">${localize(this.hass, "summary.channel")}</div>`;
    }
    if (this.definition.kind === "strip") {
      return html`<div class="subtitle">${localize(this.hass, "summary.strip")}</div>`;
    }
    if (this.definition.kind === "scene") {
      return html`<div class="subtitle">${localize(this.hass, "summary.scene")}</div>`;
    }
    if (this.definition.kind === "panel") {
      return html`<div class="subtitle">${localize(this.hass, "summary.panel")}</div>`;
    }
    return html``;
  }

  private renderControls(entity: NormalizedEntity): TemplateResult {
    if (!entity.available || entity.readOnly) {
      return html``;
    }
    switch (entity.domain) {
      case "light":
        return html`<div class="controls"><button class="text" @click=${(event: Event) => this.run(event, entity.entityId, entity.state === "on" ? "turn_off" : "turn_on")}>${entity.state === "on" ? localize(this.hass, "action.turn_off") : localize(this.hass, "action.turn_on")}</button>${this.renderLightControls(entity)}</div>`;
      case "switch":
      case "fan":
        return html`<div class="controls"><button class="text" @click=${(event: Event) => this.run(event, entity.entityId, entity.state === "on" ? "turn_off" : "turn_on")}>${entity.state === "on" ? localize(this.hass, "action.turn_off") : localize(this.hass, "action.turn_on")}</button>${entity.domain === "fan" ? this.renderFanPercentage(entity) : nothing}</div>`;
      case "button":
        return html`<div class="controls"><button class="text" @click=${(event: Event) => this.run(event, entity.entityId, "press")}>${localize(this.hass, "action.press")}</button></div>`;
      case "scene":
        return html`<div class="controls"><button class="text" @click=${(event: Event) => this.run(event, entity.entityId, "scene")}>${localize(this.hass, "action.activate")}</button></div>`;
      case "select":
        return this.renderSelect(entity);
      case "number":
        return this.renderNumber(entity);
      default:
        return html``;
    }
  }

  private renderSelect(entity: NormalizedEntity): TemplateResult {
    return html`<div class="controls">${this.renderOptionSelect(localize(this.hass, "control.option"), entity, "option", stringArrayAttr(entity.attributes, "options"))}</div>`;
  }

  private renderOptionSelect(label: string, entity: NormalizedEntity, action: string, options: string[]): TemplateResult {
    if (!options.length) {
      return html``;
    }
    return html`<label><span class="subtitle">${label}</span><select aria-label=${label} @change=${(event: Event) => this.run(event, entity.entityId, action, (event.target as HTMLSelectElement).value)}>${options.map((option) => html`<option value=${option} ?selected=${option === entity.state}>${option}</option>`)}</select></label>`;
  }

  private renderFanPercentage(entity: NormalizedEntity): TemplateResult {
    const value = Number(entity.attributes.percentage ?? 0);
    return html`<input type="range" min="0" max="100" .value=${String(value)} aria-label=${`${entity.name} ${localize(this.hass, "control.percentage")}`} @change=${(event: Event) => this.run(event, entity.entityId, "percentage", Number((event.target as HTMLInputElement).value))} />`;
  }

  private renderLightControls(entity: NormalizedEntity): TemplateResult {
    const brightness = Number(entity.attributes.brightness ?? 0);
    const brightnessPct = Math.round((brightness / 255) * 100);
    const effectList = stringArrayAttr(entity.attributes, "effect_list");
    return html`
      ${Number.isFinite(brightness) && brightness > 0 ? html`<input type="range" min="1" max="100" .value=${String(brightnessPct)} aria-label=${`${entity.name} ${localize(this.hass, "control.brightness")}`} @change=${(event: Event) => this.run(event, entity.entityId, "brightness", Number((event.target as HTMLInputElement).value))} />` : nothing}
      ${this.renderOptionSelect(localize(this.hass, "control.effect"), entity, "effect", effectList)}
    `;
  }

  private renderNumber(entity: NormalizedEntity): TemplateResult {
    const min = numberAttr(entity.attributes, "min") ?? 0;
    const max = numberAttr(entity.attributes, "max") ?? 100;
    const step = numberAttr(entity.attributes, "step") ?? 1;
    return html`<div class="controls"><input type="range" min=${min} max=${max} step=${step} .value=${entity.state} aria-label=${entity.name} @change=${(event: Event) => this.run(event, entity.entityId, "number", Number((event.target as HTMLInputElement).value))} /></div>`;
  }

  private renderExperienceTiles(config: YeelightCardConfig, main: NormalizedEntity): TemplateResult {
    const entities = this.relatedEntities(config, main).map((normalized) => ({ normalized }));
    if (!entities.length) {
      return this.renderEmptyExperience(main);
    }
    return html`<div class="tiles">${entities.map((item) => this.renderTile(item.normalized))}</div>`;
  }

  private renderTile(entity: NormalizedEntity): TemplateResult {
    const health = this.definition.kind === "health";
    return html`
      <div class=${`tile ${entity.available ? "" : "unavailable"} ${entity.readOnly ? "readonly" : ""}`}>
        <strong>${health ? healthLabel(this.hass, entity) : experienceLabel(this.hass, entity)}</strong>
        <span>${tileStateLabel(entity, this.hass)}</span>
        ${!health && !entity.readOnly && entity.available ? this.renderControls(entity) : nothing}
      </div>
    `;
  }

  private renderEmptyExperience(main: NormalizedEntity): TemplateResult {
    if (this.definition.kind === "light") {
      return html``;
    }
    const message =
      this.definition.kind === "health"
        ? localize(this.hass, "summary.health.empty")
        : this.definition.kind === "scene" || this.definition.kind === "panel"
          ? localize(this.hass, "summary.scene.empty")
          : this.definition.kind === "strip"
            ? localize(this.hass, "summary.strip.empty")
            : localize(this.hass, "summary.device.empty");
    return html`<div class="empty-line">${message}${isYeelightProEntity(this.registryIndex, main.entityId) ? "" : ` · ${localize(this.hass, "summary.yeelight_pro_hint")}`}</div>`;
  }

  private relatedEntities(config: YeelightCardConfig, main?: NormalizedEntity): NormalizedEntity[] {
    const configured = config.entities ?? [];
    const auto = this.autoRelatedEntityIds(main);
    return [...configured, ...auto]
      .map((item) => normalizeEntity(this.hass, typeof item === "string" ? item : item.entity))
      .filter((item): item is NormalizedEntity => Boolean(item && item.entityId !== main?.entityId))
      .filter((item) => supportsRelatedKind(this.definition.kind, item))
      .filter(uniqueEntity)
      .sort((left, right) => relatedRank(this.definition.kind, left) - relatedRank(this.definition.kind, right) || left.name.localeCompare(right.name))
      .slice(0, relatedLimit(this.definition.kind));
  }

  private autoRelatedEntityIds(main: NormalizedEntity | undefined): string[] {
    if (this.definition.kind === "light") {
      return [];
    }
    const deviceId = registryDeviceId(this.registryIndex, main?.entityId);
    return registryEntitiesForDevice(this.registryIndex, deviceId).filter((entityId) => entityId !== main?.entityId);
  }

  private loadRegistry(): void {
    const hass = this._hass;
    if (!this.isConnected || !hass) {
      return;
    }
    const request = ++this.registryRequest;
    loadRegistryIndex(hass).then((index) => {
      if (request === this.registryRequest && this._hass === hass) {
        this.registryIndex = index;
        this.requestUpdate();
      }
    });
  }

  private async run(event: Event, entityId: string, action: string, value?: string | number): Promise<void> {
    event.stopPropagation();
    this.error = "";
    try {
      await executeDomainAction(this.hass, entityId, action, value);
    } catch (error) {
      this.error = error instanceof Error ? error.message : String(error);
    }
  }

  private async onIconClick(event: Event, entity: NormalizedEntity): Promise<void> {
    event.stopPropagation();
    this.clearTapTimer();
    this.error = "";
    try {
      await runLovelaceAction(this, this.hass, this.config!, entity, "icon_tap");
    } catch (error) {
      this.error = error instanceof Error ? error.message : String(error);
    }
  }

  private onIconDoubleClick(event: MouseEvent, entity: NormalizedEntity): void {
    event.stopPropagation();
    event.preventDefault();
    this.clearTapTimer();
    void this.runIconAction(entity, "icon_double_tap");
  }

  private onIconHold(event: MouseEvent, entity: NormalizedEntity): void {
    event.stopPropagation();
    event.preventDefault();
    this.clearTapTimer();
    void this.runIconAction(entity, "icon_hold");
  }

  private async onSurfaceClick(event: MouseEvent, entity: NormalizedEntity): Promise<void> {
    if (isNativeControlEvent(event)) {
      return;
    }
    this.clearTapTimer();
    this.tapTimer = window.setTimeout(() => {
      this.runAction(entity, "tap");
    }, 220);
  }

  private onSurfaceDoubleClick(event: MouseEvent, entity: NormalizedEntity): void {
    if (isNativeControlEvent(event)) {
      return;
    }
    event.preventDefault();
    this.clearTapTimer();
    void this.runAction(entity, "double_tap");
  }

  private onSurfaceHold(event: MouseEvent, entity: NormalizedEntity): void {
    if (isNativeControlEvent(event)) {
      return;
    }
    event.preventDefault();
    this.clearTapTimer();
    void this.runAction(entity, "hold");
  }

  private async runAction(entity: NormalizedEntity, trigger: "tap" | "hold" | "double_tap"): Promise<void> {
    try {
      await runLovelaceAction(this, this.hass, this.config!, entity, trigger);
    } catch (error) {
      this.error = error instanceof Error ? error.message : String(error);
    }
  }

  private async runIconAction(entity: NormalizedEntity, trigger: "icon_hold" | "icon_double_tap"): Promise<void> {
    this.error = "";
    try {
      await runLovelaceAction(this, this.hass, this.config!, entity, trigger);
    } catch (error) {
      this.error = error instanceof Error ? error.message : String(error);
    }
  }

  private clearTapTimer(): void {
    if (this.tapTimer !== undefined) {
      window.clearTimeout(this.tapTimer);
      this.tapTimer = undefined;
    }
  }
}

function uniqueEntity(entity: NormalizedEntity, index: number, entities: NormalizedEntity[]): boolean {
  return entities.findIndex((item) => item.entityId === entity.entityId) === index;
}

function relatedLimit(kind: CardKind): number {
  return kind === "health" ? 4 : kind === "device" ? 6 : 5;
}

function isNativeControlEvent(event: Event): boolean {
  const target = event.composedPath()[0];
  return target instanceof Element && Boolean(target.closest("button,input,select,a,textarea"));
}
