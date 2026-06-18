import { createCardClass } from "./card";
import { CARD_DEFINITIONS } from "./cards/definitions";
import { YeelightCardEditor } from "./editor";
import { createEditorElement, EDITOR_TAG, LEGACY_EDITOR_TAG } from "./editor-element";
import { findEntity, domainOf, isYeelightCandidate } from "./entity";
import { stubConfig } from "./config";
import type { CardDefinition, HomeAssistant } from "./types";

const DOCUMENTATION_URL = "https://github.com/Yeelight/ha_yeelight_cards";

register();

function register(): void {
  if (!customElements.get(EDITOR_TAG)) {
    customElements.define(EDITOR_TAG, YeelightCardEditor);
  }
  if (!customElements.get(LEGACY_EDITOR_TAG)) {
    customElements.define(LEGACY_EDITOR_TAG, class extends YeelightCardEditor {});
  }
  for (const definition of CARD_DEFINITIONS) {
    if (!customElements.get(definition.tag)) {
      customElements.define(definition.tag, createCardClass(definition.kind));
    }
    patchRegisteredCardClass(definition);
  }
  registerCustomCards();
  console.info("%c YEELIGHT CARDS %c Card Pack ", "color:white;background:#111;padding:2px 4px;border-radius:4px 0 0 4px", "color:white;background:#1976d2;padding:2px 4px;border-radius:0 4px 4px 0");
}

function patchRegisteredCardClass(definition: CardDefinition): void {
  const elementClass = customElements.get(definition.tag) as
    | (CustomElementConstructor & {
        getConfigElement?: () => HTMLElement;
        getStubConfig?: (hass?: HomeAssistant) => Record<string, unknown>;
      })
    | undefined;
  if (!elementClass) {
    return;
  }
  Object.defineProperties(elementClass, {
    getConfigElement: { configurable: true, value: () => createEditorElement(definition) },
    getStubConfig: { configurable: true, value: (hass?: HomeAssistant) => stubConfig(definition.type, findEntity(hass, definition.domains)) }
  });
}

function registerCustomCards(): void {
  const cards = window.customCards ?? (window.customCards = []);
  const tags = new Set(CARD_DEFINITIONS.map((definition) => definition.tag));
  for (let index = cards.length - 1; index >= 0; index -= 1) {
    const item = cards[index];
    if (typeof item?.type === "string" && tags.has(item.type)) {
      cards.splice(index, 1);
    }
  }
  for (const definition of CARD_DEFINITIONS) {
    cards.push({
      type: definition.tag,
      name: definition.name,
      description: definition.description,
      preview: true,
      documentationURL: DOCUMENTATION_URL,
      getStubConfig: (hass?: HomeAssistant) => stubConfig(definition.type, findEntity(hass, definition.domains)),
      getConfigElement: () => createEditorElement(definition),
      getEntitySuggestion: (hass: HomeAssistant, entityId: string) => suggestion(hass, entityId, definition)
    });
  }
}

function suggestion(hass: HomeAssistant, entityId: string, definition: CardDefinition) {
  if (!hass?.states?.[entityId] || !definition.domains.includes(domainOf(entityId))) {
    return null;
  }
  if (!isMeaningfulSuggestion(hass, entityId, definition)) {
    return null;
  }
  return {
    label: definition.label,
    config: {
      type: definition.type,
      entity: entityId
    }
  };
}

function isMeaningfulSuggestion(hass: HomeAssistant, entityId: string, definition: CardDefinition): boolean {
  const domain = domainOf(entityId);
  if (isYeelightCandidate(hass.states[entityId])) {
    return true;
  }
  if (definition.semantic === "light") {
    return domain === "light";
  }
  if (definition.semantic === "scene") {
    return ["scene", "button", "select"].includes(domain);
  }
  if (definition.semantic === "strip") {
    return domain === "light" && /strip|led|rgb|color|gradient|灯带|彩光/i.test(entityId + " " + String(hass.states[entityId].attributes?.friendly_name ?? ""));
  }
  if (definition.semantic === "health") {
    return /lan|firmware|gateway|cloud|online|update|固件|网关|在线|局域网/i.test(entityId + " " + String(hass.states[entityId].attributes?.friendly_name ?? ""));
  }
  return false;
}

export { CARD_DEFINITIONS };
