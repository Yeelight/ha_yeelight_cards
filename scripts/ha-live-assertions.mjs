import { chromium } from "playwright";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { createHash } from "node:crypto";

const url = process.env.HA_LIVE_URL ?? "http://localhost:18124/yeelight-cards-live-validation/cards";
const username = process.env.HA_LIVE_USERNAME ?? "lucore_test";
const password = process.env.HA_LIVE_PASSWORD ?? "Lucore2026!";
const bundlePath = process.env.HA_LIVE_CARD_BUNDLE ?? resolve(import.meta.dirname, "../dist/ha_yeelight_cards.js");
const interceptBundle = process.env.HA_LIVE_INTERCEPT_BUNDLE === "1";
const staticResourceRe = /\/local\/ha_yeelight_cards\/ha_yeelight_cards\.js(?:\?|$)/;
const browser = await chromium.launch({ headless: process.env.HA_LIVE_HEADLESS !== "0" });
const context = await browser.newContext({
  locale: process.env.HA_LIVE_LOCALE ?? "zh-CN",
  viewport: { width: 1280, height: 900 }
});
const cardBundle = await readFile(bundlePath);
const expectedBundleHash = sha256(cardBundle);
const expectedBundleVersion = expectedBundleHash.slice(0, 12);
if (interceptBundle) {
  await context.route("**/local/ha_yeelight_cards/ha_yeelight_cards.js*", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "text/javascript; charset=utf-8",
      body: cardBundle
    });
  });
}
const page = await context.newPage();
const bundleResponses = [];
page.on("response", (response) => {
  if (staticResourceRe.test(response.url())) {
    bundleResponses.push(captureBundleResponse(response));
  }
});
const tags = ["yeelight-light-card", "yeelight-room-card", "yeelight-scene-card", "yeelight-strip-card", "yeelight-health-card", "yeelight-channel-card", "yeelight-panel-card", "yeelight-device-card"];
const liveEntityId = "light.1_31ce_shi_deng_zu_1_31ce_shi_deng_zu_deng_zu_1";

try {
  await authenticate(page, url);
  await waitForHass(page);
  await waitForCards(page);
  const staticBundle = interceptBundle ? { mode: "intercepted", expectedHash: expectedBundleHash } : await assertStaticBundleLoaded(bundleResponses, expectedBundleHash, expectedBundleVersion);
  const result = await page.evaluate(async () => {
    const tags = window.__YEELIGHT_LIVE_TAGS__;
    const cards = tags.map((tag) => deepQuery(tag));
    if (cards.some((card) => !card)) {
      return { ok: false, missing: tags.filter((_, index) => !cards[index]) };
    }
    const hass = document.querySelector("home-assistant").hass;
    const original = hass.callService;
    const calls = [];
    hass.callService = async (domain, service, data) => {
      calls.push({ domain, service, data });
    };
    try {
      for (const card of cards) {
        const more = card.shadowRoot?.querySelector("button.icon");
        more?.click();
        await settle();
      }
      const firstWritable = cards.map((card) => card.shadowRoot?.querySelector("button.text:not([disabled])")).find(Boolean);
      firstWritable?.click();
      await settle(260);
    } finally {
      hass.callService = original;
    }
    return {
      ok: true,
      count: cards.length,
      customCards: window.customCards?.filter((item) => tags.includes(item.type)).length,
      calls,
      text: cards.map((card) => card.shadowRoot?.textContent?.replace(/\s+/g, " ").trim().slice(0, 240))
    };

    function deepQuery(selector, root = document) {
      const found = root.querySelector(selector);
      if (found) return found;
      for (const element of root.querySelectorAll("*")) {
        if (element.shadowRoot) {
          const nested = deepQuery(selector, element.shadowRoot);
          if (nested) return nested;
        }
      }
      return null;
    }

    function settle(delay = 0) {
      return new Promise((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => {
          if (delay) {
            setTimeout(resolve, delay);
          } else {
            resolve();
          }
        }));
      });
    }
  });
  if (!result.ok) {
    throw new Error(JSON.stringify(result));
  }
  const englishLeak = result.text.find((text) => /Diagnostics|lighting layers active|Turn on|Turn off|Read only|Unavailable|Option|Effect|Main \/ ambient|Color, effect|Scene panel/.test(text));
  if (englishLeak) {
    throw new Error(`English primary label leaked in card text: ${englishLeak}`);
  }
  const visualEditor = await assertVisualEditor(page);
  console.log(JSON.stringify({ ...result, staticBundle, visualEditor }, null, 2));
  console.log("ha-live-assertions-ok");
} finally {
  await browser.close();
}

async function captureBundleResponse(response) {
  const body = await response.body();
  return {
    url: response.url(),
    status: response.status(),
    hash: sha256(body)
  };
}

async function assertStaticBundleLoaded(responsePromises, expectedHash, expectedVersion) {
  const responses = (await Promise.all(responsePromises)).filter((item) => item.status >= 200 && item.status < 300);
  const latest = responses.at(-1);
  if (!latest) {
    throw new Error("Home Assistant did not request /local/ha_yeelight_cards/ha_yeelight_cards.js.");
  }
  if (!latest.url.includes(`v=${expectedVersion}`)) {
    throw new Error(`ha_yeelight_cards Lovelace resource version is stale: expected v=${expectedVersion}, got ${latest.url}.`);
  }
  if (latest.hash !== expectedHash) {
    throw new Error(`ha_yeelight_cards static bundle hash mismatch: expected ${expectedHash}, got ${latest.hash} from ${latest.url}.`);
  }
  return latest;
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function nativeLabels() {
  return ["实体", "标题", "名称", "图标", "图标高度", "颜色", "主题", "列数", "布局", "内容布局", "隐藏状态", "显示名称", "显示实体图片", "显示控制项", "点击", "图标点击", "长按", "图标长按", "双击", "图标双击"];
}

function nativeFieldNames() {
  return ["entity", "entities", "title", "name", "icon", "icon_height", "color", "theme", "columns", "layout", "content_layout", "vertical", "fill_container", "primary_info", "secondary_info", "state_content", "icon_type", "icon_shape", "show_entity_picture", "show_name", "show_icon", "show_state", "hide_state", "show_controls", "state_color", "appearance", "tap_action", "icon_tap_action", "hold_action", "icon_hold_action", "double_tap_action", "icon_double_tap_action"];
}

async function authenticate(page, targetUrl = url) {
  await page.goto(targetUrl, { waitUntil: "domcontentloaded" });
  if (await hasHass(page, 5000)) {
    return;
  }
  for (let attempt = 0; attempt < 3; attempt += 1) {
    await submitLogin(page);
    if (await hasHass(page, 15000)) {
      break;
    }
    await page.goto(targetUrl, { waitUntil: "domcontentloaded" });
    if (await hasHass(page, 15000)) {
      break;
    }
  }
  if (!(await hasHass(page, 5000))) {
    const body = await page.locator("body").innerText().catch(() => "");
    throw new Error(`Home Assistant login did not complete. url=${page.url()} body=${body.slice(0, 500)}`);
  }
  if (!page.url().startsWith(targetUrl)) {
    await page.goto(targetUrl, { waitUntil: "domcontentloaded" });
  }
}

async function submitLogin(page) {
  const usernameInput = page.locator("input[name='username']");
  await usernameInput.waitFor({ timeout: 25000 });
  await usernameInput.fill(username);
  await page.locator("input[name='password']").fill(password);
  const loginButton = page.locator('ha-button[variant="brand"]').first();
  if (await loginButton.count()) {
    await loginButton.click({ timeout: 10000 });
    return;
  }
  const buttons = await page.evaluate(() => Array.from(document.querySelectorAll("ha-button")).map((item) => ({ text: item.textContent?.trim(), variant: item.getAttribute("variant"), visible: Boolean(item.getClientRects().length) })));
  throw new Error(`Could not find Home Assistant login button: ${JSON.stringify(buttons)}`);
}

async function hasHass(page, timeout) {
  try {
    await page.waitForFunction(() => Boolean(document.querySelector("home-assistant")?.hass), undefined, { timeout });
    return true;
  } catch {
    return false;
  }
}

async function waitForHass(page) {
  if (await hasHass(page, 30000)) {
    return;
  }
  const body = await page.locator("body").innerText().catch(() => "");
  throw new Error(`Authenticated Home Assistant frontend was not available. url=${page.url()} body=${body.slice(0, 500)}`);
}

async function waitForCards(page) {
  await page.evaluate((value) => {
    window.__YEELIGHT_LIVE_TAGS__ = value;
  }, tags);
  await page.waitForFunction(
    (expectedTags) => expectedTags.every((tag) => {
      const found = document.querySelector(tag);
      if (found) return true;
      const search = (root) => {
        for (const element of root.querySelectorAll("*")) {
          if (element.shadowRoot?.querySelector(tag)) return true;
          if (element.shadowRoot && search(element.shadowRoot)) return true;
        }
        return false;
      };
      return search(document);
    }),
    tags,
    { timeout: 30000 }
  );
}

async function assertVisualEditor(page) {
  const editUrl = `${url}${url.includes("?") ? "&" : "?"}edit=1&cache=20260617-native-fields-3`;
  if (await hasHass(page, 5000)) {
    await page.evaluate((target) => history.replaceState(null, "", target), editUrl);
  } else {
    await authenticate(page, editUrl);
  }
  await waitForHass(page);
  await waitForCards(page);
  await page.evaluate(() => {
    const card = deepQuery("yeelight-room-card");
    card?.scrollIntoView({ block: "center" });

    function deepQuery(selector, root = document) {
      const found = root.querySelector(selector);
      if (found) return found;
      for (const element of root.querySelectorAll("*")) {
        if (element.shadowRoot) {
          const nested = deepQuery(selector, element.shadowRoot);
          if (nested) return nested;
        }
      }
      return null;
    }
  });
  const opened = await page.evaluate(() => {
    const card = deepQuery("yeelight-room-card");
    return Boolean(card);

    function deepQuery(selector, root = document) {
      const found = root.querySelector(selector);
      if (found) return found;
      for (const element of root.querySelectorAll("*")) {
        if (element.shadowRoot) {
          const nested = deepQuery(selector, element.shadowRoot);
          if (nested) return nested;
        }
      }
      return null;
    }
  });
  if (!opened) {
    throw new Error("Could not find yeelight-room-card for editor validation.");
  }
  const nativeEditorOpened = await openCardEditor(page);
  if (!nativeEditorOpened) {
    await mountRegisteredEditor(page);
  }
  const editorResult = await page.evaluate(async ({ requiredLabels, requiredFields, probeEntity }) => {
    const bodyText = document.body.textContent ?? "";
    const editor = deepQuery("ha-yeelight-card-editor");
    const form = editor?.shadowRoot?.querySelector("ha-form");
    const schema = flattenSchema(form?.schema ?? []);
    const schemaNames = unique(schema.map((item) => item.name).filter(Boolean));
    const editorText = editor ? deepText(editor.shadowRoot).replace(/\s+/g, " ").trim() : "";
    const nativeFieldNames = await collectNativeFieldNames(probeEntity);
    const missingNativeFields = nativeFieldNames.filter((field) => !schemaNames.includes(field));
    const rawObjectFields = ["features", "grid_options", "visibility"].filter((field) => schemaNames.includes(field));
    const objectSelectorFields = schema.filter((item) => JSON.stringify(item.selector) === JSON.stringify({ object: {} })).map((item) => item.name);
    return {
      unsupported: bodyText.includes("不支持可视化编辑器") || bodyText.includes("does not have a visual editor"),
      editor: Boolean(editor),
      hasForm: Boolean(form),
      hasRequiredLabels: requiredLabels.every((label) => editorText.includes(label)),
      hasRequiredFields: requiredFields.every((field) => schemaNames.includes(field)),
      oldEditorLeak: /推荐实体|自动关联|Yeelight 体验增强|可选显示增强|相关 HA 实体|不支持的卡片配置/.test(editorText),
      nativeFieldNames,
      missingNativeFields,
      rawObjectFields,
      objectSelectorFields,
      schemaNames,
      editorText: editorText.slice(0, 300)
    };

    function deepQuery(selector, root = document) {
      const found = root.querySelector(selector);
      if (found) return found;
      for (const element of root.querySelectorAll("*")) {
        if (element.shadowRoot) {
          const nested = deepQuery(selector, element.shadowRoot);
          if (nested) return nested;
        }
      }
      return null;
    }

    function deepQueryAll(selector, root = document) {
      const found = Array.from(root.querySelectorAll?.(selector) ?? []);
      for (const element of root.querySelectorAll?.("*") ?? []) {
        if (element.shadowRoot) {
          found.push(...deepQueryAll(selector, element.shadowRoot));
        }
      }
      return found;
    }

    function flattenSchema(schema) {
      return Array.isArray(schema) ? schema.flatMap((item) => (Array.isArray(item.schema) ? flattenSchema(item.schema) : [item])) : [];
    }

    function deepText(root) {
      let text = root?.textContent ?? "";
      for (const element of root?.querySelectorAll?.("*") ?? []) {
        if (element.shadowRoot) {
          text += ` ${deepText(element.shadowRoot)}`;
        }
      }
      return text;
    }

    function unique(items) {
      return Array.from(new Set(items));
    }

    async function collectNativeFieldNames(entityId) {
      const hass = document.querySelector("home-assistant")?.hass;
      const probes = [
        { tag: "hui-tile-card", config: { type: "tile", entity: entityId } },
        { tag: "hui-light-card", config: { type: "light", entity: entityId } },
        { tag: "hui-button-card", config: { type: "button", entity: entityId } },
        { tag: "hui-glance-card", config: { type: "glance", entities: [entityId] } }
      ];
      const fields = [];
      for (const probe of probes) {
        let nativeEditor;
        try {
          nativeEditor = await customElements.get(probe.tag)?.getConfigElement?.();
          if (!nativeEditor) {
            continue;
          }
          nativeEditor.hass = hass;
          nativeEditor.setConfig?.(probe.config);
          nativeEditor.style.display = "none";
          document.body.append(nativeEditor);
          await nativeEditor.updateComplete?.catch?.(() => undefined);
          await new Promise((resolve) => setTimeout(resolve, 450));
          await nativeEditor.updateComplete?.catch?.(() => undefined);
          for (const nativeForm of deepQueryAll("ha-form", nativeEditor.shadowRoot || nativeEditor)) {
            fields.push(...flattenSchema(nativeForm.schema ?? []).map((item) => item.name).filter(Boolean));
          }
        } finally {
          nativeEditor?.remove?.();
        }
      }
      return unique(fields).sort();
    }
  }, { requiredLabels: nativeLabels(), requiredFields: nativeFieldNames(), probeEntity: liveEntityId });
  if (
    editorResult.unsupported ||
    !editorResult.editor ||
    !editorResult.hasForm ||
    !editorResult.hasRequiredLabels ||
    !editorResult.hasRequiredFields ||
    editorResult.missingNativeFields.length ||
    editorResult.rawObjectFields.length ||
    editorResult.objectSelectorFields.length ||
    editorResult.oldEditorLeak
  ) {
    throw new Error(`Visual editor did not open: ${JSON.stringify(editorResult)}`);
  }
  return editorResult;
}

async function openCardEditor(page) {
  const clickedNativeMenu = await page.evaluate(async () => {
    const room = deepQuery("yeelight-room-card");
    const editMode = room?.parentElement?.parentElement;
    const root = editMode?.shadowRoot;
    let item = root?.querySelector('ha-dropdown-item[value="edit"]');
    if (!item || !item.getClientRects().length) {
      const trigger = root?.querySelector("ha-dropdown.more ha-icon-button, ha-dropdown.more [slot='trigger'], ha-dropdown.more ha-button");
      trigger?.click?.();
      await new Promise((resolve) => setTimeout(resolve, 500));
      item = root?.querySelector('ha-dropdown-item[value="edit"]');
    }
    item?.click?.();
    await new Promise((resolve) => setTimeout(resolve, 800));
    return Boolean(item);

    function deepQuery(selector, root = document) {
      const found = root.querySelector(selector);
      if (found) return found;
      for (const element of root.querySelectorAll("*")) {
        if (element.shadowRoot) {
          const nested = deepQuery(selector, element.shadowRoot);
          if (nested) return nested;
        }
      }
      return null;
    }
  });
  if (clickedNativeMenu) {
    await waitForEditor(page);
    return true;
  }
  const editSelectors = [
    "text=编辑",
    "text=Edit",
    "text=配置",
    "text=Configure",
    "ha-icon-button[title*='编辑']",
    "ha-icon-button[title*='Edit']"
  ];
  for (const selector of editSelectors) {
    const item = page.locator(selector).first();
    if (await item.isVisible().catch(() => false)) {
      await item.click();
      await waitForEditor(page);
      return true;
    }
  }
  const clicked = await page.evaluate(async () => {
    const candidates = Array.from(document.querySelectorAll("*")).flatMap((element) => {
      const root = element.shadowRoot;
      return root ? Array.from(root.querySelectorAll("ha-icon-button, mwc-icon-button, mwc-list-item, ha-md-list-item, button")) : [];
    });
    const edit = candidates.find((element) => /编辑|Edit|Configure|配置/i.test(element.textContent ?? element.getAttribute("title") ?? element.getAttribute("aria-label") ?? ""));
    edit?.click?.();
    await new Promise((resolve) => setTimeout(resolve, 800));
    return Boolean(edit);
  });
  if (clicked) {
    await waitForEditor(page);
    return true;
  }
  return false;
}

async function mountRegisteredEditor(page) {
  const result = await page.evaluate(async () => {
    const meta = window.customCards?.find((item) => item.type === "yeelight-room-card");
    const elementClass = customElements.get("yeelight-room-card");
    const editor = meta?.getConfigElement?.() ?? elementClass?.getConfigElement?.();
    if (!editor) {
      return { ok: false, reason: "missing getConfigElement" };
    }
    editor.setConfig?.({ type: "custom:yeelight-room-card", entity: "light.1_31ce_shi_deng_zu_1_31ce_shi_deng_zu_deng_zu_1" });
    editor.hass = document.querySelector("home-assistant")?.hass;
    editor.id = "yeelight-live-mounted-editor";
    document.body.append(editor);
    await editor.updateComplete;
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    return {
      ok: Boolean(editor.shadowRoot?.querySelector("ha-form")),
      tag: editor.localName,
      text: deepText(editor.shadowRoot).replace(/\s+/g, " ").trim().slice(0, 300),
      oldEditorLeak: /推荐实体|自动关联|Yeelight 体验增强|可选显示增强|相关 HA 实体|不支持的卡片配置/.test(deepText(editor.shadowRoot))
    };

    function deepText(root) {
      let text = root?.textContent ?? "";
      for (const element of root?.querySelectorAll?.("*") ?? []) {
        if (element.shadowRoot) {
          text += ` ${deepText(element.shadowRoot)}`;
        }
      }
      return text;
    }
  });
  if (!result.ok || result.oldEditorLeak) {
    throw new Error(`Registered editor did not render native ha-form: ${JSON.stringify(result)}`);
  }
}

async function waitForEditor(page) {
  await page.waitForFunction(
    () => {
      const search = (selector, root = document) => {
        const found = root.querySelector(selector);
        if (found) return found;
        for (const element of root.querySelectorAll("*")) {
          if (element.shadowRoot) {
            const nested = search(selector, element.shadowRoot);
            if (nested) return nested;
          }
        }
        return null;
      };
      const editor = search("ha-yeelight-card-editor");
      const form = editor?.shadowRoot?.querySelector("ha-form");
      const schemaNames = flattenSchema(form?.schema ?? []).map((item) => item.name).filter(Boolean);
      const editorText = editor ? deepText(editor.shadowRoot) : "";
      return (Boolean(form) && ["实体", "标题", "名称", "图标", "主题", "布局", "点击", "图标点击", "图标长按", "图标双击"].every((label) => editorText.includes(label)) && ["entity", "entities", "title", "name", "icon", "theme", "content_layout", "tap_action", "icon_tap_action", "icon_hold_action", "icon_double_tap_action"].every((field) => schemaNames.includes(field)) && ["features", "grid_options", "visibility"].every((field) => !schemaNames.includes(field))) || (document.body.textContent ?? "").includes("不支持可视化编辑器");

      function flattenSchema(schema) {
        return Array.isArray(schema) ? schema.flatMap((item) => (Array.isArray(item.schema) ? flattenSchema(item.schema) : [item])) : [];
      }

      function deepText(root) {
        let text = root?.textContent ?? "";
        for (const element of root?.querySelectorAll?.("*") ?? []) {
          if (element.shadowRoot) {
            text += ` ${deepText(element.shadowRoot)}`;
          }
        }
        return text;
      }
    },
    undefined,
    { timeout: 15000 }
  );
}

function flattenSchema(schema) {
  return Array.isArray(schema) ? schema.flatMap((item) => (Array.isArray(item.schema) ? flattenSchema(item.schema) : [item])) : [];
}

function deepText(root) {
  let text = root?.textContent ?? "";
  for (const element of root?.querySelectorAll?.("*") ?? []) {
    if (element.shadowRoot) {
      text += ` ${deepText(element.shadowRoot)}`;
    }
  }
  return text;
}
