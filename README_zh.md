# Yeelight Cards

面向 Home Assistant 原生 Lovelace 体系的易来灯光体验卡片插件。

这次重建从空目录开始，不保留旧专用卡实现：

- 通过 `window.customCards` 进入 HA 卡片选择器
- 通过卡片类静态 `getConfigElement` 提供 HA 原生可视化 editor
- `getStubConfig` 和 `getEntitySuggestion` 同步、克制、按 domain 收敛
- 内置中文 / 英文文案，跟随 HA 前端语言显示
- 控制只调用 Home Assistant 标准服务
- 保留 `ha-card` 外壳和 HA theme variables

## 卡片

- `custom:yeelight-light-card`
- `custom:yeelight-room-card`
- `custom:yeelight-scene-card`
- `custom:yeelight-strip-card`
- `custom:yeelight-health-card`
- `custom:yeelight-channel-card`
- `custom:yeelight-panel-card`
- `custom:yeelight-device-card`

这不是 HA 原生卡片的品牌皮肤，而是 Yeelight Card Pack：重点表达多通道灯具、房间级灯光、场景/效果、灯带/多区、情景面板和健康诊断。

## 示例

```yaml
type: custom:yeelight-light-card
entity: light.living_room
entities:
  - light.living_room_ambient
  - select.living_room_effect
```

可视化编辑器只暴露和 HA 原生卡片一致的主配置项：实体、名称、图标、布局、主要/次要信息、显示开关、点击/长按/双击动作。运行态的 Yeelight 同设备聚合只使用前端可见的 HA 状态、实体注册表和设备注册表；控制仍然只调用 Home Assistant 标准服务。
