import { describe, expect, it } from "vitest";
import { entity, hass } from "./fixtures";
import "../src/index";

describe("card rendering", () => {
  it("renders a light card and dispatches more-info", async () => {
    const card = document.createElement("yeelight-light-card") as HTMLElement & { setConfig: (config: unknown) => void; hass: unknown; updateComplete: Promise<boolean> };
    card.setConfig({ type: "custom:yeelight-light-card", entity: "light.office" });
    card.hass = hass({ "light.office": entity("light.office", "on", { friendly_name: "Office" }) });
    document.body.append(card);
    await card.updateComplete;
    expect(card.shadowRoot?.textContent).toContain("Office");
    let detail: unknown;
    card.addEventListener("hass-more-info", (event) => (detail = (event as CustomEvent).detail));
    card.shadowRoot?.querySelector("button.icon")?.dispatchEvent(new MouseEvent("click", { bubbles: true, composed: true }));
    expect(detail).toEqual({ entityId: "light.office" });
    card.remove();
  });

  it("renders Chinese UI labels from Home Assistant locale", async () => {
    const card = document.createElement("yeelight-room-card") as HTMLElement & { setConfig: (config: unknown) => void; hass: unknown; updateComplete: Promise<boolean> };
    card.setConfig({ type: "custom:yeelight-room-card", entity: "light.office", entities: ["light.ambient"], show_controls: true });
    card.hass = hass({
      "light.office": entity("light.office", "off", { friendly_name: "主灯" }),
      "light.ambient": entity("light.ambient", "on", { friendly_name: "氛围灯" })
    });
    document.body.append(card);
    await card.updateComplete;
    const text = card.shadowRoot?.textContent ?? "";
    expect(text).toContain("Yeelight 房间");
    expect(text).toContain("已开启 1/2 个照明层");
    expect(text).toContain("开启");
    expect(text).not.toContain("lighting layers active");
    expect(text).not.toContain("Turn on");
    card.remove();
  });

  it("normalizes empty configs with the concrete card type fallback", async () => {
    const card = document.createElement("yeelight-panel-card") as HTMLElement & { setConfig: (config: unknown) => void; hass: unknown; updateComplete: Promise<boolean> };
    card.setConfig({});
    card.hass = hass({ "light.office": entity("light.office", "on", { friendly_name: "书房灯" }) });
    document.body.append(card);
    await card.updateComplete;

    expect(card.shadowRoot?.textContent).toContain("请选择一个 Home Assistant 实体");
    card.remove();
  });

  it("uses sanitized HA sections grid options from config", async () => {
    const card = document.createElement("yeelight-device-card") as HTMLElement & {
      setConfig: (config: unknown) => void;
      getGridOptions: () => Record<string, number>;
    };
    card.setConfig({
      type: "custom:yeelight-device-card",
      entity: "light.office",
      grid_options: { columns: 9, rows: 4, min_columns: 4, min_rows: 3, invalid: "bad" }
    });

    expect(card.getGridOptions()).toEqual({ columns: 9, rows: 4, min_columns: 4, min_rows: 3 });
  });

  it("applies native display fields at runtime", async () => {
    const card = document.createElement("yeelight-light-card") as HTMLElement & { setConfig: (config: unknown) => void; hass: unknown; updateComplete: Promise<boolean> };
    card.setConfig({
      type: "custom:yeelight-light-card",
      entity: "light.office",
      title: "Lighting title",
      theme: "lucore_light",
      icon_height: "48",
      content_layout: "vertical",
      show_name: false,
      hide_state: true
    });
    card.hass = hass({ "light.office": entity("light.office", "on", { friendly_name: "Office" }) });
    document.body.append(card);
    await card.updateComplete;

    const haCard = card.shadowRoot?.querySelector("ha-card") as HTMLElement & { header?: string; theme?: string };
    expect(haCard?.header).toBe("Lighting title");
    expect(haCard?.theme).toBe("lucore_light");
    expect(card.shadowRoot?.querySelector(".card")?.classList.contains("vertical")).toBe(true);
    expect(card.shadowRoot?.querySelector(".icon")?.getAttribute("style")).toContain("48px");
    expect(card.shadowRoot?.querySelector(".title")).toBeNull();
    expect(card.shadowRoot?.querySelector(".state")).toBeNull();
    card.remove();
  });

  it("auto-groups same-device Yeelight Pro capabilities without editor-side association", async () => {
    const card = document.createElement("yeelight-channel-card") as HTMLElement & { setConfig: (config: unknown) => void; hass: unknown; updateComplete: Promise<boolean> };
    card.setConfig({ type: "custom:yeelight-channel-card", entity: "light.main" });
    card.hass = hass(
      {
        "light.main": entity("light.main", "on", { friendly_name: "主光" }),
        "light.ambient": entity("light.ambient", "off", { friendly_name: "氛围灯" }),
        "switch.relay": entity("switch.relay", "off", { friendly_name: "继电器" }),
        "sensor.lux": entity("sensor.lux", "328", { friendly_name: "照度", unit_of_measurement: "lx" }),
        "button.movie": entity("button.movie", "unknown", { friendly_name: "观影场景" }),
        "light.other_brand": entity("light.other_brand", "on", { friendly_name: "第三方灯" })
      },
      [],
      {
        entities: [
          { entity_id: "light.main", platform: "yeelight_pro", device_id: "lamp-1" },
          { entity_id: "light.ambient", platform: "yeelight_pro", device_id: "lamp-1" },
          { entity_id: "switch.relay", platform: "yeelight_pro", device_id: "lamp-1" },
          { entity_id: "sensor.lux", platform: "yeelight_pro", device_id: "lamp-1" },
          { entity_id: "button.movie", platform: "yeelight_pro", device_id: "lamp-1" },
          { entity_id: "light.other_brand", platform: "other_platform", device_id: "lamp-1" }
        ]
      }
    );
    document.body.append(card);
    await waitForText(card, "照度");

    const text = card.shadowRoot?.textContent ?? "";
    expect(text).toContain("氛围光");
    expect(text).toContain("继电器");
    expect(text).toContain("照度");
    expect(text).not.toContain("场景 未知");
    expect(text).not.toContain("观影场景");
    expect(text).not.toContain("第三方灯");
    card.remove();
  });

  it("renders scene and button entities as actionable entries instead of unknown state noise", async () => {
    const card = document.createElement("yeelight-scene-card") as HTMLElement & { setConfig: (config: unknown) => void; hass: unknown; updateComplete: Promise<boolean> };
    card.setConfig({ type: "custom:yeelight-scene-card", entity: "button.movie", entities: ["scene.sleep"] });
    card.hass = hass({
      "button.movie": entity("button.movie", "unknown", { friendly_name: "观影模式" }),
      "scene.sleep": entity("scene.sleep", "unknown", { friendly_name: "睡眠模式" })
    });
    document.body.append(card);
    await card.updateComplete;

    const text = card.shadowRoot?.textContent ?? "";
    expect(text).toContain("可执行");
    expect(text).not.toContain("未知");
    card.remove();
  });
});

async function waitForText(card: HTMLElement & { updateComplete: Promise<boolean> }, expected: string): Promise<void> {
  for (let index = 0; index < 10; index += 1) {
    await card.updateComplete;
    if (card.shadowRoot?.textContent?.includes(expected)) {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
}
