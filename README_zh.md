# Yeelight Cards

[English](README.md) | [中文](README_zh.md)

Yeelight Cards 是面向 Home Assistant Lovelace 仪表盘的易来灯光体验卡片包。
它是前端 Dashboard 插件：在浏览器里读取 Home Assistant 实体状态、实体注册表
和设备注册表，并通过 Home Assistant 标准服务执行控制。

它本身不连接易来云端、局域网网关或私有部署。它可以配合任意 Home Assistant
实体使用；如果已安装 Yeelight Pro 集成，也可以展示和聚合同设备下的
Yeelight Pro 实体。

## 卡片

| 卡片类型 | 重点用途 | 建议实体域 |
| --- | --- | --- |
| `custom:yeelight-light-card` | 单灯控制 | `light` |
| `custom:yeelight-room-card` | 房间灯光层和摘要 | `light`、`group`、`switch` |
| `custom:yeelight-scene-card` | 场景、按钮、效果和模式 | `scene`、`button`、`select` |
| `custom:yeelight-strip-card` | 灯带、渐变、效果和相关参数 | `light`、`select`、`number`、`sensor` |
| `custom:yeelight-health-card` | 在线、固件、LAN、网关、云端和更新诊断 | `sensor`、`binary_sensor`、`switch`、`update` |
| `custom:yeelight-channel-card` | 主光、氛围光、夜灯、继电器和多通道层 | `light`、`switch`、`number`、`select`、`sensor` |
| `custom:yeelight-panel-card` | 情景面板和点击式控制 | `light`、`button`、`select`、`number`、`sensor`、`switch` |
| `custom:yeelight-device-card` | 设备级 Yeelight Pro 能力摘要 | `light`、`switch`、`sensor`、`binary_sensor`、`event`、`button`、`select`、`number`、`scene`、`update` |

## 安装

### HACS 安装

[![打开 Home Assistant 并把本仓库添加到 HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=Yeelight&repository=ha_yeelight_cards&category=plugin)

可以点击上方快捷入口，也可以手动添加：

1. 打开 Home Assistant。
2. 进入 **HACS**。
3. 打开右上角三个点菜单，选择 **Custom repositories**。
4. **Repository** 填写：

   ```text
   https://github.com/Yeelight/ha_yeelight_cards
   ```

5. **Type** 选择 **Dashboard**。
6. 点击 **Add**。
7. 在 HACS 中打开 **Yeelight Cards** 并点击 **Download**。
8. HACS 添加仪表盘资源后，刷新浏览器页面。

HACS 应该通过以下路径加载卡片 bundle：

```text
/hacsfiles/ha_yeelight_cards/ha_yeelight_cards.js
```

### 手动安装

构建或下载 `dist/ha_yeelight_cards.js`，复制到：

```text
/config/www/ha_yeelight_cards/ha_yeelight_cards.js
```

然后在仪表盘资源中添加 JavaScript module：

```yaml
url: /local/ha_yeelight_cards/ha_yeelight_cards.js
type: module
```

## 示例

```yaml
type: custom:yeelight-light-card
entity: light.living_room
entities:
  - light.living_room_ambient
  - select.living_room_effect
```

## 配置

可视化编辑器暴露 Home Assistant 原生字段：

- `entity`、`entities`、`title`、`name`、`icon`、`theme`、`columns`
- 布局和外观：`layout`、`content_layout`、`appearance`、
  `fill_container`、`vertical`
- 显示控制：`primary_info`、`secondary_info`、`state_content`、
  `icon_type`、`icon_shape`、`show_entity_picture`、`show_name`、
  `show_icon`、`show_state`、`hide_state`、`show_controls`、`state_color`
- 动作：`tap_action`、`hold_action`、`double_tap_action`、
  `icon_tap_action`、`icon_hold_action`、`icon_double_tap_action`

卡片选择器元数据通过 `window.customCards` 注册；每个卡片类也提供静态
`getConfigElement()` 和 `getStubConfig()`。

## 控制能力

卡片只调用 Home Assistant 标准服务：

- `light.turn_on` / `light.turn_off`，实体暴露相关属性时支持亮度百分比和效果选择
- `switch.turn_on` / `switch.turn_off`
- `fan.turn_on` / `fan.turn_off` / `fan.set_percentage`
- `button.press`
- `scene.turn_on`
- `select.select_option`
- `number.set_value`

不可用、只读或不支持的实体只展示状态，不显示写控制项。

## Yeelight Pro 感知

当 Home Assistant registry API 可用时，卡片会识别 `yeelight_pro` 平台实体，
并可自动聚合同一设备下的 Yeelight Pro 实体，用于房间、多通道、灯带、健康、
场景、面板和设备摘要。若 registry 不可读，手动配置的 `entities` 仍会正常渲染。

## 开发

```bash
npm install
npm run build
npm run lint
npm test
npm run test:browser
```

真实 Home Assistant 验证：

```bash
HA_LIVE_URL=http://localhost:18124/yeelight-cards-live-validation/cards \
HA_LIVE_USERNAME=<username> \
HA_LIVE_PASSWORD=<password> \
npm run test:ha-live
```

## 边界

- 这是 Lovelace 前端插件，不是 Home Assistant 集成。
- 它不会创建实体、设备、自动化、场景或服务。
- 它不实现易来云端登录、局域网控制、私有部署或推送订阅。
- 它不替代所有通用卡片；基础实体仍优先使用 HA Tile/Light 等原生卡片。

## 许可证

MIT License
