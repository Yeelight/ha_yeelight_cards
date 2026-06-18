import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, resolve } from "node:path";
import { chromium } from "playwright";

const root = resolve(import.meta.dirname, "..");
const server = createServer(async (req, res) => {
  const url = new URL(req.url || "/", "http://localhost");
  const path = resolve(root, `.${url.pathname}`);
  if (!path.startsWith(root)) {
    res.writeHead(403).end();
    return;
  }
  try {
    const body = await readFile(path);
    res.writeHead(200, { "content-type": type(path) }).end(body);
  } catch {
    res.writeHead(404).end();
  }
});

await new Promise((resolveListen) => server.listen(0, resolveListen));
const address = server.address();
const url = `http://127.0.0.1:${address.port}/harness/index.html`;
const browser = await chromium.launch({ headless: true });

try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  page.on("pageerror", (error) => {
    throw error;
  });
  await page.goto(url, { waitUntil: "networkidle" });
  await page.evaluate(() => window.yeelightHarness.mountAll());
  await expect(page, () => document.querySelectorAll("#cards > *").length, 8, "card count");
  await expect(page, () => window.customCards.length, 8, "customCards count");
  await expect(page, () => Array.from(document.querySelectorAll("#cards > *")).every((card) => card.shadowRoot?.textContent?.trim()), true, "nonblank cards");
  await page.locator("yeelight-light-card").locator("button.text").first().click();
  await expect(page, () => window.yeelightHarness.serviceCalls.at(-1), { domain: "light", service: "turn_off", data: { entity_id: "light.main" } }, "light service");
  await page.locator("yeelight-device-card input[type='range']").first().evaluate((input) => {
    input.value = "4";
    input.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
  });
  await expect(page, () => window.yeelightHarness.serviceCalls.at(-1), { domain: "number", service: "set_value", data: { entity_id: "number.timeout", value: 4 } }, "number service");
  await expect(page, () => Boolean(document.querySelector("yeelight-health-card").shadowRoot.textContent.includes("诊断")), true, "health diagnostics");
  await expect(page, () => Boolean(document.querySelector("yeelight-room-card").shadowRoot.textContent.includes("照明层")), true, "room lighting summary");
  await waitFor(page, () => document.querySelector("yeelight-room-card").shadowRoot.textContent.includes("氛围光"), true, "auto grouped room ambient layer");
  await waitFor(page, () => document.querySelector("yeelight-channel-card").shadowRoot.textContent.includes("继电器"), true, "auto grouped channel relay");
  await waitFor(page, () => document.querySelector("yeelight-strip-card").shadowRoot.textContent.includes("模式 / 效果"), true, "auto grouped strip effect selector");
  await expect(page, () => Array.from(document.querySelectorAll("#cards > *")).every((card) => !/Diagnostics|lighting layers active|Turn on|Turn off|Related HA entities/.test(card.shadowRoot?.textContent ?? "")), true, "no English primary labels");
  await page.setViewportSize({ width: 330, height: 820 });
  await expect(page, () => document.documentElement.scrollWidth - document.documentElement.clientWidth <= 1, true, "no horizontal overflow");
  const editor = await page.evaluateHandle(() => window.yeelightHarness.mountEditor());
  await expect(page, (element) => Boolean(element.shadowRoot.querySelector("ha-form")), true, "editor ha-form", editor);
  await expect(page, (element) => ["实体", "标题", "名称", "图标", "图标高度", "颜色", "主题", "列数", "布局", "内容布局", "隐藏状态", "显示名称", "显示实体图片", "显示控制项", "点击", "图标点击", "长按", "图标长按", "双击", "图标双击"].every((label) => element.shadowRoot.textContent.includes(label)), true, "editor native labels", editor);
  await page.evaluate((fields) => {
    window.__YEELIGHT_NATIVE_FIELDS__ = fields;
  }, nativeFieldNames());
  await expect(
    page,
    (element) => {
      const flatten = (schema) => (Array.isArray(schema) ? schema.flatMap((item) => (Array.isArray(item.schema) ? flatten(item.schema) : [item])) : []);
      const schema = flatten(element.shadowRoot.querySelector("ha-form").schema);
      const names = schema.map((item) => item.name);
      const hasRequiredFields = window.__YEELIGHT_NATIVE_FIELDS__.every((field) => names.includes(field));
      const hidesRawObjectFields = ["features", "grid_options", "visibility"].every((field) => !names.includes(field));
      const hasNoObjectSelector = schema.every((item) => JSON.stringify(item.selector) !== JSON.stringify({ object: {} }));
      return hasRequiredFields && hidesRawObjectFields && hasNoObjectSelector;
    },
    true,
    "editor native schema fields",
    editor
  );
  await expect(page, (element) => !/推荐实体|自动关联|Yeelight 体验增强|可选显示增强|相关 HA 实体|Related HA entities|不支持的卡片配置|Unsupported card config/.test(element.shadowRoot.textContent), true, "editor old field leak", editor);
  console.log("browser-assertions-ok");
} finally {
  await browser.close();
  await new Promise((resolveClose) => server.close(resolveClose));
}

async function expect(page, fn, expected, label, arg) {
  const actual = await page.evaluate(fn, arg);
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`${label}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

async function waitFor(page, fn, expected, label, arg) {
  await page
    .waitForFunction(({ source, expectedValue }) => JSON.stringify(new Function(`return (${source})()`)()) === JSON.stringify(expectedValue), { source: String(fn), expectedValue: expected }, { timeout: 5000 })
    .catch(async () => {
      await expect(page, fn, expected, label, arg);
    });
}

function type(path) {
  return extname(path) === ".html" ? "text/html" : extname(path) === ".ts" || extname(path) === ".js" ? "text/javascript" : "text/plain";
}

function nativeFieldNames() {
  return ["entity", "entities", "title", "name", "icon", "icon_height", "color", "theme", "columns", "layout", "content_layout", "vertical", "fill_container", "primary_info", "secondary_info", "state_content", "icon_type", "icon_shape", "show_entity_picture", "show_name", "show_icon", "show_state", "hide_state", "show_controls", "state_color", "appearance", "tap_action", "icon_tap_action", "hold_action", "icon_hold_action", "double_tap_action", "icon_double_tap_action"];
}

function flattenSchema(schema) {
  return Array.isArray(schema) ? schema.flatMap((item) => (Array.isArray(item.schema) ? flattenSchema(item.schema) : [item])) : [];
}
