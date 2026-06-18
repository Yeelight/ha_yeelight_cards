import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { normalizeConfig } from "../src/config";
import { CARD_DEFINITIONS } from "../src/cards/definitions";

describe("config", () => {
  it("defaults to HA-native options", () => {
    const config = normalizeConfig({ type: "custom:yeelight-light-card", entity: "light.office" });
    expect(config).toMatchObject({
      show_icon: true,
      show_state: true,
      show_controls: true,
      icon_type: "icon",
      icon_shape: "circle"
    });
    expect(config).not.toHaveProperty("prefer_yeelight");
    expect(config).not.toHaveProperty("show_brand");
  });

  it("normalizes additional entities", () => {
    expect(normalizeConfig({ type: "custom:yeelight-room-card", entities: ["sensor.lux", { entity: "switch.relay", name: "Relay" }] }).entities).toEqual(["sensor.lux", { entity: "switch.relay", name: "Relay" }]);
  });

  it("normalizes native editor appearance fields", () => {
    expect(
      normalizeConfig({
        type: "custom:yeelight-light-card",
        title: "Lights",
        color: "amber",
        icon_height: "48",
        theme: "lucore_light",
        columns: 4,
        content_layout: "vertical",
        icon_type: "entity-picture",
        icon_shape: "rounded",
        show_entity_picture: true,
        show_name: false,
        hide_state: true,
        vertical: true,
        state_content: ["state", "brightness"],
        grid_options: { columns: 6, rows: 2 },
        icon_hold_action: { action: "more-info" },
        icon_double_tap_action: { action: "more-info" },
        icon_tap_action: { action: "more-info" },
        tap_action: { action: "toggle" }
      })
    ).toMatchObject({
      title: "Lights",
      color: "amber",
      icon_height: "48",
      theme: "lucore_light",
      columns: 4,
      content_layout: "vertical",
      icon_type: "entity-picture",
      icon_shape: "rounded",
      show_entity_picture: true,
      show_name: false,
      hide_state: true,
      vertical: true,
      state_content: ["state", "brightness"],
      grid_options: { columns: 6, rows: 2 },
      icon_hold_action: { action: "more-info" },
      icon_double_tap_action: { action: "more-info" },
      icon_tap_action: { action: "more-info" },
      tap_action: { action: "toggle" }
    });
    expect(normalizeConfig({ type: "custom:yeelight-light-card", icon_type: "invalid", icon_shape: "invalid" })).toMatchObject({
      icon_type: "icon",
      icon_shape: "circle"
    });
  });

  it("accepts HA editor type variants for every card", () => {
    for (const definition of CARD_DEFINITIONS) {
      expect(normalizeConfig({ type: definition.type }).type).toBe(definition.type);
      expect(normalizeConfig({ type: definition.tag }).type).toBe(definition.type);
      expect(normalizeConfig({ type: definition.kind }).type).toBe(definition.type);
    }
  });

  it("keeps public docs free of removed legacy flags", () => {
    const docs = ["README.md", "README_zh.md"].map((file) => readFileSync(resolve(import.meta.dirname, "..", file), "utf8")).join("\n");
    expect(docs).not.toMatch(/\bprefer_yeelight\b|\bshow_brand\b/);
  });
});
