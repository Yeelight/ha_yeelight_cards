# Yeelight Cards

[English](README.md) | [中文](README_zh.md)

Yeelight 专用的 Lovelace 自定义卡片集合。

## 功能特性

- ✅ 灯光控制卡片（亮度、色温、RGB）
- ✅ 场景卡片（场景激活和管理）
- ✅ 设备状态卡片
- ✅ 空调控制卡片
- ✅ 窗帘控制卡片
- ✅ 风扇控制卡片
- ✅ 门锁控制卡片
- ✅ 扫地机器人卡片
- ✅ 多种卡片变体

## 安装

### HACS 安装（推荐）

1. 打开 HACS
2. 搜索 "Yeelight Cards"
3. 点击安装
4. 重启 Home Assistant

### 手动安装

1. 下载最新版本
2. 解压到 `custom_components/yeelight_cards/`
3. 将 `www/yeelight_cards/` 复制到 `config/www/`
4. 重启 Home Assistant

## 卡片列表

### yeelight-light-card

灯光控制卡片，支持亮度、色温、RGB 控制。

```yaml
type: custom:yeelight-light-card
entity: light.yeelight_bedroom
name: 卧室灯
variant: detailed
```

**变体**：

- `simple`：简洁模式
- `detailed`：详细模式
- `slider`：滑块模式
- `knob`：旋钮模式

### yeelight-scene-card

场景卡片，支持场景激活和管理。

```yaml
type: custom:yeelight-scene-card
entity: scene.movie_mode
name: 观影模式
variant: grid
```

**变体**：

- `grid`：网格模式
- `list`：列表模式
- `carousel`：轮播模式

### yeelight-device-card

设备状态卡片，显示设备状态和控制。

```yaml
type: custom:yeelight-device-card
entity: switch.yeelight_plug
name: 智能插座
variant: status
```

**变体**：

- `status`：状态模式
- `control`：控制模式
- `detail`：详情模式

### yeelight-climate-card

空调控制卡片。

```yaml
type: custom:yeelight-climate-card
entity: climate.yeelight_ac
name: 空调
```

### yeelight-cover-card

窗帘控制卡片。

```yaml
type: custom:yeelight-cover-card
entity: cover.yeelight_curtain
name: 窗帘
```

### yeelight-fan-card

风扇控制卡片。

```yaml
type: custom:yeelight-fan-card
entity: fan.yeelight_fan
name: 风扇
```

### yeelight-lock-card

门锁控制卡片。

```yaml
type: custom:yeelight-lock-card
entity: lock.yeelight_door_lock
name: 门锁
```

### yeelight-vacuum-card

扫地机器人卡片。

```yaml
type: custom:yeelight-vacuum-card
entity: vacuum.yeelight_robot
name: 扫地机器人
```

## 配置选项

所有卡片都支持以下配置选项：

| 选项 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `entity` | string | 必填 | 实体 ID |
| `name` | string | 实体名称 | 卡片名称 |
| `variant` | string | 默认变体 | 卡片变体 |
| `tap_action` | object | - | 点击动作 |
| `hold_action` | object | - | 长按动作 |
| `show_header` | boolean | true | 显示头部 |
| `show_state` | boolean | true | 显示状态 |

## 依赖

- **ha_yeelight_pro**：Yeelight Pro 集成（软依赖）

## 许可证

MIT License
