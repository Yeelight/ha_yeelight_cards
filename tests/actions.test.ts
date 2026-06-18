import { describe, expect, it } from "vitest";
import { executeDomainAction, runLovelaceAction } from "../src/actions";
import { normalizeConfig } from "../src/config";
import { entity, hass } from "./fixtures";

describe("actions", () => {
  it("calls standard HA services", async () => {
    const calls: Array<Record<string, unknown>> = [];
    const ha = hass({ "number.timeout": entity("number.timeout", "1", { min: 0, max: 10, step: 1 }) }, calls);
    await executeDomainAction(ha, "number.timeout", "number", 4);
    expect(calls).toEqual([{ domain: "number", service: "set_value", data: { entity_id: "number.timeout", value: 4 } }]);
  });

  it("rejects unavailable write actions", async () => {
    const ha = hass({ "switch.bad": entity("switch.bad", "unavailable") });
    await expect(executeDomainAction(ha, "switch.bad", "turn_on")).rejects.toThrow("not available");
  });

  it("maps Yeelight light experience controls to light.turn_on", async () => {
    const calls: Array<Record<string, unknown>> = [];
    const ha = hass({ "light.main": entity("light.main", "on") }, calls);
    await executeDomainAction(ha, "light.main", "brightness", 64);
    await executeDomainAction(ha, "light.main", "effect", "Movie");
    expect(calls).toEqual([
      { domain: "light", service: "turn_on", data: { entity_id: "light.main", brightness_pct: 64 } },
      { domain: "light", service: "turn_on", data: { entity_id: "light.main", effect: "Movie" } }
    ]);
  });

  it("uses icon_tap_action independently from surface tap_action", async () => {
    const calls: Array<Record<string, unknown>> = [];
    const ha = hass({ "light.main": entity("light.main", "on") }, calls);
    const host = document.createElement("div");
    const moreInfo: unknown[] = [];
    host.addEventListener("hass-more-info", (event) => moreInfo.push((event as CustomEvent).detail));

    await runLovelaceAction(
      host,
      ha,
      normalizeConfig({
        type: "custom:yeelight-light-card",
        entity: "light.main",
        tap_action: { action: "toggle" },
        icon_tap_action: { action: "more-info" }
      }),
      {
        entityId: "light.main",
        domain: "light",
        state: "on",
        name: "Main",
        icon: "mdi:lightbulb",
        available: true,
        readOnly: false,
        attributes: {}
      },
      "icon_tap"
    );

    expect(calls).toEqual([]);
    expect(moreInfo).toEqual([{ entityId: "light.main" }]);
  });

  it("supports native tile icon hold and icon double-tap action fields", async () => {
    const ha = hass({ "light.main": entity("light.main", "on") });
    const host = document.createElement("div");
    const moreInfo: unknown[] = [];
    host.addEventListener("hass-more-info", (event) => moreInfo.push((event as CustomEvent).detail));
    const config = normalizeConfig({
      type: "custom:yeelight-light-card",
      entity: "light.main",
      icon_hold_action: { action: "more-info" as const },
      icon_double_tap_action: { action: "more-info" as const }
    });
    const normalized = {
      entityId: "light.main",
      domain: "light",
      state: "on",
      name: "Main",
      icon: "mdi:lightbulb",
      available: true,
      readOnly: false,
      attributes: {}
    };

    await runLovelaceAction(host, ha, config, normalized, "icon_hold");
    await runLovelaceAction(host, ha, config, normalized, "icon_double_tap");

    expect(moreInfo).toEqual([{ entityId: "light.main" }, { entityId: "light.main" }]);
  });
});
