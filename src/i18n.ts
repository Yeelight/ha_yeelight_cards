import { EN, ZH, type TranslationKey } from "./translations";
import type { CardKind, HomeAssistant } from "./types";

type Locale = "zh" | "en";

export function localize(hass: HomeAssistant | undefined, key: string, values: Record<string, string | number> = {}): string {
  const dictionary = localeOf(hass) === "zh" ? ZH : EN;
  return interpolate(dictionary[key as TranslationKey] ?? EN[key as TranslationKey] ?? key, values);
}

export function localizeStatic(key: string, language = "zh-Hans"): string {
  const dictionary = isChinese(language) ? ZH : EN;
  return interpolate(dictionary[key as TranslationKey] ?? EN[key as TranslationKey] ?? key);
}

export function stateText(hass: HomeAssistant | undefined, state: string): string {
  const key = `state.${state}`;
  return hasTranslation(key) ? localize(hass, key) : state;
}

export function domainText(hass: HomeAssistant | undefined, domain: string): string {
  const key = `domain.${domain}`;
  return hasTranslation(key) ? localize(hass, key) : domain;
}

export function cardKey(kind: CardKind, field: "name" | "description" | "label"): TranslationKey {
  return `card.${kind}.${field}` as TranslationKey;
}

function localeOf(hass: HomeAssistant | undefined): Locale {
  return isChinese(hass?.locale?.language) ? "zh" : "en";
}

function hasTranslation(key: string): key is TranslationKey {
  return key in EN;
}

function isChinese(language: string | undefined): boolean {
  return !language || /^zh\b|^zh-/i.test(language);
}

function interpolate(template: string, values: Record<string, string | number> = {}): string {
  return Object.entries(values).reduce((text, [key, value]) => text.replaceAll(`{${key}}`, String(value)), template);
}
