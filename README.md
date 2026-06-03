# Yeelight Cards

[English](README.md) | [中文](README_zh.md)

Custom Lovelace card collection for Yeelight devices.

## Features

- ✅ Light control card (brightness, color temperature, RGB)
- ✅ Scene card (scene activation and management)
- ✅ Device status card
- ✅ Climate control card
- ✅ Cover control card
- ✅ Fan control card
- ✅ Lock control card
- ✅ Vacuum card
- ✅ Multiple card variants

## Installation

### HACS Installation (Recommended)

1. Open HACS
2. Search for "Yeelight Cards"
3. Click Install
4. Restart Home Assistant

### Manual Installation

1. Download the latest release
2. Extract to `custom_components/yeelight_cards/`
3. Copy `www/yeelight_cards/` to `config/www/`
4. Restart Home Assistant

## Card List

### yeelight-light-card

Light control card with brightness, color temperature, and RGB support.

```yaml
type: custom:yeelight-light-card
entity: light.yeelight_bedroom
name: Bedroom Light
variant: detailed
```

**Variants**:

- `simple`: Simple mode
- `detailed`: Detailed mode
- `slider`: Slider mode
- `knob`: Knob mode

### yeelight-scene-card

Scene card for scene activation and management.

```yaml
type: custom:yeelight-scene-card
entity: scene.movie_mode
name: Movie Mode
variant: grid
```

**Variants**:

- `grid`: Grid mode
- `list`: List mode
- `carousel`: Carousel mode

### yeelight-device-card

Device status card showing device state and controls.

```yaml
type: custom:yeelight-device-card
entity: switch.yeelight_plug
name: Smart Plug
variant: status
```

**Variants**:

- `status`: Status mode
- `control`: Control mode
- `detail`: Detail mode

### yeelight-climate-card

Climate control card.

```yaml
type: custom:yeelight-climate-card
entity: climate.yeelight_ac
name: Air Conditioner
```

### yeelight-cover-card

Cover control card.

```yaml
type: custom:yeelight-cover-card
entity: cover.yeelight_curtain
name: Curtain
```

### yeelight-fan-card

Fan control card.

```yaml
type: custom:yeelight-fan-card
entity: fan.yeelight_fan
name: Fan
```

### yeelight-lock-card

Lock control card.

```yaml
type: custom:yeelight-lock-card
entity: lock.yeelight_door_lock
name: Door Lock
```

### yeelight-vacuum-card

Vacuum robot card.

```yaml
type: custom:yeelight-vacuum-card
entity: vacuum.yeelight_robot
name: Robot Vacuum
```

## Configuration Options

All cards support the following configuration options:

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `entity` | string | Required | Entity ID |
| `name` | string | Entity name | Card name |
| `variant` | string | Default variant | Card variant |
| `tap_action` | object | - | Tap action |
| `hold_action` | object | - | Hold action |
| `show_header` | boolean | true | Show header |
| `show_state` | boolean | true | Show state |

## Dependencies

- **ha_yeelight_pro**: Yeelight Pro integration (soft dependency)

## License

MIT License
