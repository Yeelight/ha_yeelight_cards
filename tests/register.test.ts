import { describe, expect, it } from "vitest";
import { CARD_DEFINITIONS } from "../src/cards/definitions";
import { entity, hass } from "./fixtures";
import "../src/index";

describe("card registration", () => {
  it("registers only the clean core card set", () => {
    expect(CARD_DEFINITIONS).toHaveLength(8);
    for (const definition of CARD_DEFINITIONS) {
      expect(customElements.get(definition.tag)).toBeTruthy();
    }
    const types = window.customCards?.map((item) => item.type);
    expect(types).toEqual(CARD_DEFINITIONS.map((definition) => definition.tag));
    expect(types).toContain("yeelight-room-card");
    expect(types).toContain("yeelight-health-card");
    expect(types).toContain("yeelight-strip-card");
    expect(types).not.toContain("yeelight-motion-card");
    expect(types).not.toContain("yeelight-switch-card");
  });

  it("keeps stubs HA-native and suggestions Yeelight-scoped", () => {
    const ha = hass({ "light.office": entity("light.office", "on") });
    const meta = window.customCards?.find((item) => item.type === "yeelight-light-card");
    expect((meta?.getStubConfig as (hass: unknown) => unknown)?.(ha)).toEqual({ type: "custom:yeelight-light-card", entity: "light.office" });
    expect((meta?.getEntitySuggestion as (hass: unknown, entityId: string) => unknown)?.(ha, "light.office")).toEqual({
      label: "Yeelight 灯光",
      config: { type: "custom:yeelight-light-card", entity: "light.office" }
    });
  });

  it("exposes HA visual editor contract on each card element class", () => {
    for (const definition of CARD_DEFINITIONS) {
      const meta = window.customCards?.find((item) => item.type === definition.tag);
      const elementClass = customElements.get(definition.tag) as CustomElementConstructor & {
        getConfigElement?: () => HTMLElement;
        getStubConfig?: (hass?: unknown) => Record<string, unknown>;
      };
      expect(meta?.getConfigElement).toBeTypeOf("function");
      expect(meta?.getStubConfig).toBeTypeOf("function");
      expect((meta?.getConfigElement as () => HTMLElement)?.().tagName.toLowerCase()).toBe("ha-yeelight-card-editor");
      expect((meta?.getStubConfig as (hass?: unknown) => Record<string, unknown>)?.()).toEqual({ type: definition.type });
      expect(elementClass.getConfigElement?.().tagName.toLowerCase()).toBe("ha-yeelight-card-editor");
      expect(elementClass.getStubConfig).toBeTypeOf("function");
      expect(elementClass.getStubConfig?.()).toEqual({ type: definition.type });
    }
  });

  it("does not flood unrelated entities with Yeelight experience suggestions", () => {
    const ha = hass({
      "sensor.router": entity("sensor.router", "ok"),
      "sensor.yeelink_firmware": entity("sensor.yeelink_firmware", "1.2.3", { friendly_name: "Yeelight firmware" })
    });
    const health = window.customCards?.find((item) => item.type === "yeelight-health-card");
    expect((health?.getEntitySuggestion as (hass: unknown, entityId: string) => unknown)?.(ha, "sensor.router")).toBeNull();
    expect((health?.getEntitySuggestion as (hass: unknown, entityId: string) => unknown)?.(ha, "sensor.yeelink_firmware")).toMatchObject({
      config: { type: "custom:yeelight-health-card", entity: "sensor.yeelink_firmware" }
    });
  });
});
