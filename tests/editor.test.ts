import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { CARD_DEFINITIONS } from "../src/cards/definitions";
import { entity, hass } from "./fixtures";
import "../src/index";

describe("editor", () => {
  beforeAll(() => {
    defineHaEditorStubs();
  });

  afterEach(() => {
    document.body.replaceChildren();
  });

  it("keeps the visual editor focused on Home Assistant native fields", async () => {
    const editor = mountEditor({ type: "custom:yeelight-room-card", entity: "light.office" });
    editor.hass = hass({
      "light.office": entity("light.office", "on", { friendly_name: "书房主灯", manufacturer: "Yeelight" }),
      "switch.office_ambient": entity("switch.office_ambient", "off", { friendly_name: "书房氛围灯", manufacturer: "Yeelight" })
    });
    await settle(editor);

    const text = editor.shadowRoot?.textContent ?? "";
    expect(text).toContain("Yeelight 房间");
    expect(text).not.toContain("推荐实体");
    expect(text).not.toContain("自动关联");
    expect(text).not.toContain("Yeelight 体验增强");
    expect(text).not.toContain("可选显示增强");
    expect(text).not.toContain("相关 HA 实体");
    expect(editor.shadowRoot?.querySelector("ha-form")).toBeTruthy();
    expect(flattenSchemas(editor).map((item) => item.name)).toEqual(
      expect.arrayContaining(nativeFieldNames())
    );
    expect(editor.shadowRoot?.querySelector("textarea")).toBeNull();
    expect(editor.shadowRoot?.querySelectorAll("button.choice,button.related,button.link")).toHaveLength(0);
  });

  it("emits config changes from HA native entity selector events", async () => {
    const editor = mountEditor({ type: "custom:yeelight-light-card", entity: "light.office" });
    editor.hass = hass({ "light.office": entity("light.office", "on", { friendly_name: "书房灯" }) });
    await settle(editor);

    const changes: unknown[] = [];
    editor.addEventListener("config-changed", (event) => changes.push((event as CustomEvent).detail.config));
    editor.shadowRoot?.querySelector("ha-form")?.dispatchEvent(new CustomEvent("value-changed", { detail: { value: { entity: "light.living" } }, bubbles: true, composed: true }));

    expect(changes.at(-1)).toMatchObject({ type: "custom:yeelight-light-card", entity: "light.living" });
  });

  it("uses HA native selector schema and hides Yeelight-only toggles", async () => {
    const editor = mountEditor({ type: "custom:yeelight-light-card", entity: "light.office" });
    editor.hass = hass({ "light.office": entity("light.office", "on", { friendly_name: "书房灯", manufacturer: "Yeelight" }) });
    await settle(editor);

    const schemas = flattenSchemas(editor);

    expect(schemas).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "entity", selector: { entity: { domain: ["light"] } } }),
        expect.objectContaining({ name: "entities", selector: { entity: { domain: ["light"], multiple: true } } }),
        expect.objectContaining({ name: "name", selector: { entity_name: {} }, context: { entity: "entity" } }),
        expect.objectContaining({ name: "title", selector: { text: {} } }),
        expect.objectContaining({ name: "icon", selector: { icon: {} }, context: { icon_entity: "entity" } }),
        expect.objectContaining({ name: "icon_height", selector: expect.objectContaining({ text: expect.any(Object) }) }),
        expect.objectContaining({ name: "color", selector: { ui_color: {} } }),
        expect.objectContaining({ name: "theme", selector: { theme: {} } }),
        expect.objectContaining({ name: "columns", selector: expect.objectContaining({ number: expect.any(Object) }) }),
        expect.objectContaining({ name: "layout", selector: expect.objectContaining({ select: expect.any(Object) }) }),
        expect.objectContaining({ name: "content_layout", selector: expect.objectContaining({ select: expect.any(Object) }) }),
        expect.objectContaining({ name: "vertical", selector: { boolean: {} } }),
        expect.objectContaining({ name: "fill_container", selector: { boolean: {} } }),
        expect.objectContaining({ name: "primary_info", selector: expect.objectContaining({ select: expect.any(Object) }) }),
        expect.objectContaining({ name: "secondary_info", selector: expect.objectContaining({ select: expect.any(Object) }) }),
        expect.objectContaining({ name: "state_content", selector: expect.objectContaining({ select: expect.any(Object) }) }),
        expect.objectContaining({ name: "icon_type", selector: expect.objectContaining({ select: expect.any(Object) }) }),
        expect.objectContaining({ name: "icon_shape", selector: expect.objectContaining({ select: expect.any(Object) }) }),
        expect.objectContaining({ name: "show_entity_picture", selector: { boolean: {} } }),
        expect.objectContaining({ name: "show_name", selector: { boolean: {} } }),
        expect.objectContaining({ name: "show_icon", selector: { boolean: {} } }),
        expect.objectContaining({ name: "show_state", selector: { boolean: {} } }),
        expect.objectContaining({ name: "hide_state", selector: { boolean: {} } }),
        expect.objectContaining({ name: "show_controls", selector: { boolean: {} } }),
        expect.objectContaining({ name: "state_color", selector: { boolean: {} } }),
        expect.objectContaining({ name: "appearance", selector: expect.objectContaining({ select: expect.any(Object) }) }),
        expect.objectContaining({ name: "tap_action", selector: expect.objectContaining({ ui_action: expect.any(Object) }) }),
        expect.objectContaining({ name: "icon_tap_action", selector: expect.objectContaining({ ui_action: expect.any(Object) }) }),
        expect.objectContaining({ name: "hold_action", selector: expect.objectContaining({ ui_action: expect.any(Object) }) }),
        expect.objectContaining({ name: "icon_hold_action", selector: expect.objectContaining({ ui_action: expect.any(Object) }) }),
        expect.objectContaining({ name: "double_tap_action", selector: expect.objectContaining({ ui_action: expect.any(Object) }) }),
        expect.objectContaining({ name: "icon_double_tap_action", selector: expect.objectContaining({ ui_action: expect.any(Object) }) })
      ])
    );
    expect(schemas.map((item) => item.name)).not.toEqual(expect.arrayContaining(["features", "grid_options", "visibility", "related_entities", "prefer_yeelight", "show_brand"]));
    expect(schemas.some((item) => JSON.stringify(item.selector) === JSON.stringify({ object: {} }))).toBe(false);
    expect(editor.shadowRoot?.querySelectorAll("input,select,textarea")).toHaveLength(0);
  });

  it("emits config changes from HA form fields and normalizes native actions", async () => {
    const editor = mountEditor({ type: "custom:yeelight-light-card", entity: "light.office" });
    editor.hass = hass({ "light.office": entity("light.office", "on", { friendly_name: "书房灯" }) });
    await settle(editor);

    const changes: unknown[] = [];
    editor.addEventListener("config-changed", (event) => changes.push((event as CustomEvent).detail.config));
    editor.shadowRoot?.querySelector("ha-form")?.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: {
          value: {
            name: "Reading",
            title: "Reading card",
            icon: "mdi:desk-lamp",
            entities: ["light.ambient", "sensor.lux"],
            icon_height: "48",
            color: "amber",
            theme: "lucore_light",
            columns: 3,
            icon_type: "entity-picture",
            icon_shape: "rounded",
            show_entity_picture: true,
            show_name: false,
            vertical: true,
            content_layout: "vertical",
            hide_state: true,
            state_content: ["state", "brightness"],
            tap_action: { action: "toggle" },
            icon_tap_action: { action: "more-info" },
            hold_action: { action: "more-info" },
            icon_hold_action: { action: "more-info" },
            double_tap_action: { action: "none" },
            icon_double_tap_action: { action: "more-info" }
          }
        },
        bubbles: true,
        composed: true
      })
    );

    expect(changes.at(-1)).toMatchObject({
      type: "custom:yeelight-light-card",
      name: "Reading",
      title: "Reading card",
      icon: "mdi:desk-lamp",
      entities: ["light.ambient", "sensor.lux"],
      icon_height: "48",
      color: "amber",
      theme: "lucore_light",
      columns: 3,
      icon_type: "entity-picture",
      icon_shape: "rounded",
      show_entity_picture: true,
      show_name: false,
      vertical: true,
      content_layout: "vertical",
      hide_state: true,
      state_content: ["state", "brightness"],
      tap_action: { action: "toggle" },
      icon_tap_action: { action: "more-info" },
      hold_action: { action: "more-info" },
      icon_hold_action: { action: "more-info" },
      double_tap_action: { action: "none" },
      icon_double_tap_action: { action: "more-info" }
    });
  });

  it("supports the visual editor contract for all card type forms", async () => {
    for (const definition of CARD_DEFINITIONS) {
      for (const type of [definition.type, definition.tag, definition.kind]) {
        const editor = mountEditor({ type, entity: "light.office" });
        editor.hass = hass({ "light.office": entity("light.office", "on", { friendly_name: "书房灯", manufacturer: "Yeelight" }) });
        await settle(editor);
        const text = editor.shadowRoot?.textContent ?? "";
        expect(text).toContain(localName(definition.kind));
        expect(text).not.toContain("不支持的卡片配置");
        expect(text).not.toContain("推荐实体");
        expect(text).not.toContain("自动关联");
        expect(text).not.toContain("Yeelight 体验增强");
        expect(editor.shadowRoot?.querySelector("ha-form")).toBeTruthy();
        expect(flattenSchemas(editor).map((item) => item.name)).toEqual(expect.arrayContaining(nativeFieldNames()));
        expect(flattenSchemas(editor).some((item) => JSON.stringify(item.selector).includes("textarea"))).toBe(false);
        editor.remove();
      }
    }
  });

  it("uses cardType fallback when Home Assistant opens an empty editor config", async () => {
    const editor = document.createElement("ha-yeelight-card-editor") as EditorElement;
    editor.cardType = "custom:yeelight-panel-card";
    editor.setConfig({});
    editor.hass = hass({ "light.office": entity("light.office", "on", { friendly_name: "书房灯", manufacturer: "Yeelight" }) });
    document.body.append(editor);
    await settle(editor);

    expect(editor.shadowRoot?.textContent).toContain("Yeelight 面板");
    expect(editor.shadowRoot?.textContent).not.toContain("不支持的卡片配置");
  });
});

type EditorElement = HTMLElement & {
  setConfig: (config: unknown) => void;
  hass: unknown;
  cardType?: string;
  updateComplete: Promise<boolean>;
};

type HaFormElement = HTMLElement & {
  schema?: Array<Record<string, unknown>>;
};

function defineHaEditorStubs(): void {
  if (!customElements.get("ha-form")) {
    customElements.define("ha-form", class extends HTMLElement {});
  }
  if (!customElements.get("ha-expansion-panel")) {
    customElements.define("ha-expansion-panel", class extends HTMLElement {});
  }
  if (!customElements.get("ha-icon")) {
    customElements.define("ha-icon", class extends HTMLElement {});
  }
}

function mountEditor(config: unknown): EditorElement {
  const editor = document.createElement("ha-yeelight-card-editor") as EditorElement;
  editor.setConfig(config);
  document.body.append(editor);
  return editor;
}

async function settle(editor: EditorElement) {
  await editor.updateComplete;
  await Promise.resolve();
  await editor.updateComplete;
  await Promise.resolve();
  await editor.updateComplete;
}

function localName(kind: string): string {
  return `Yeelight ${kind === "light" ? "灯光" : kind === "room" ? "房间" : kind === "scene" ? "场景" : kind === "strip" ? "灯带" : kind === "health" ? "诊断" : kind === "channel" ? "多通道" : kind === "panel" ? "面板" : "设备"}`;
}

function formSchemas(editor: EditorElement): Array<Array<Record<string, unknown>>> {
  return Array.from(editor.shadowRoot?.querySelectorAll<HaFormElement>("ha-form") ?? []).map((form) => form.schema ?? []);
}

function flattenSchemas(editor: EditorElement): Array<Record<string, unknown>> {
  return formSchemas(editor).flatMap((schema) => flatten(schema));
}

function flatten(schema: Array<Record<string, unknown>>): Array<Record<string, unknown>> {
  return schema.flatMap((item) => (Array.isArray(item.schema) ? flatten(item.schema as Array<Record<string, unknown>>) : [item]));
}

function nativeFieldNames(): string[] {
  return ["entity", "entities", "title", "name", "icon", "icon_height", "color", "theme", "columns", "layout", "content_layout", "vertical", "fill_container", "primary_info", "secondary_info", "state_content", "icon_type", "icon_shape", "show_entity_picture", "show_name", "show_icon", "show_state", "hide_state", "show_controls", "state_color", "appearance", "tap_action", "icon_tap_action", "hold_action", "icon_hold_action", "double_tap_action", "icon_double_tap_action"];
}
