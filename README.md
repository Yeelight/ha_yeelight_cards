# Yeelight Cards

[English](README.md) | [中文](README_zh.md)

Yeelight Cards is a Home Assistant Lovelace card pack for Yeelight lighting
experiences. It is a frontend dashboard plugin: it reads Home Assistant entity
state, entity registry data, and device registry data from the browser, then
calls standard Home Assistant services for control.

It does not connect to Yeelight cloud, LAN gateways, or private deployments by
itself. Pair it with normal Home Assistant entities, including entities created
by the Yeelight Pro integration when available.

## Cards

| Card type | Focus | Suggested domains |
| --- | --- | --- |
| `custom:yeelight-light-card` | Single light control | `light` |
| `custom:yeelight-room-card` | Room lighting layers and summaries | `light`, `group`, `switch` |
| `custom:yeelight-scene-card` | Scenes, buttons, effects, and modes | `scene`, `button`, `select` |
| `custom:yeelight-strip-card` | Strips, gradients, effects, and related parameters | `light`, `select`, `number`, `sensor` |
| `custom:yeelight-health-card` | Online, firmware, LAN, gateway, cloud, and update diagnostics | `sensor`, `binary_sensor`, `switch`, `update` |
| `custom:yeelight-channel-card` | Main light, ambient light, night light, relay, and channel layers | `light`, `switch`, `number`, `select`, `sensor` |
| `custom:yeelight-panel-card` | Scene panels and tap-oriented controls | `light`, `button`, `select`, `number`, `sensor`, `switch` |
| `custom:yeelight-device-card` | Device-level Yeelight Pro capability summary | `light`, `switch`, `sensor`, `binary_sensor`, `event`, `button`, `select`, `number`, `scene`, `update` |

## Installation

### HACS Installation

[![Open your Home Assistant instance and add this repository to HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=Yeelight&repository=ha_yeelight_cards&category=plugin)

Use the shortcut above, or add the repository manually:

1. Open Home Assistant.
2. Go to **HACS**.
3. Open the three-dot menu and select **Custom repositories**.
4. Set **Repository** to:

   ```text
   https://github.com/Yeelight/ha_yeelight_cards
   ```

5. Set **Type** to **Dashboard**.
6. Click **Add**.
7. Open **Yeelight Cards** in HACS and click **Download**.
8. Refresh the browser after HACS finishes adding the dashboard resource.

HACS should serve the card bundle from:

```text
/hacsfiles/ha_yeelight_cards/ha_yeelight_cards.js
```

### Manual Installation

Build or download `dist/ha_yeelight_cards.js`, copy it to:

```text
/config/www/ha_yeelight_cards/ha_yeelight_cards.js
```

Then add a dashboard JavaScript module resource:

```yaml
url: /local/ha_yeelight_cards/ha_yeelight_cards.js
type: module
```

## Example

```yaml
type: custom:yeelight-light-card
entity: light.living_room
entities:
  - light.living_room_ambient
  - select.living_room_effect
```

## Configuration

The visual editor exposes Home Assistant native fields:

- `entity`, `entities`, `title`, `name`, `icon`, `theme`, `columns`
- layout and appearance: `layout`, `content_layout`, `appearance`,
  `fill_container`, `vertical`
- display controls: `primary_info`, `secondary_info`, `state_content`,
  `icon_type`, `icon_shape`, `show_entity_picture`, `show_name`, `show_icon`,
  `show_state`, `hide_state`, `show_controls`, `state_color`
- actions: `tap_action`, `hold_action`, `double_tap_action`,
  `icon_tap_action`, `icon_hold_action`, `icon_double_tap_action`

Card picker metadata is registered through `window.customCards`; every card
class also exposes static `getConfigElement()` and `getStubConfig()`.

## Controls

Cards only use standard Home Assistant services:

- `light.turn_on` / `light.turn_off`, including brightness percentage and
  effect selection when the entity exposes those attributes
- `switch.turn_on` / `switch.turn_off`
- `fan.turn_on` / `fan.turn_off` / `fan.set_percentage`
- `button.press`
- `scene.turn_on`
- `select.select_option`
- `number.set_value`

Unavailable, read-only, or unsupported entities are shown without write
controls.

## Yeelight Pro Awareness

When Home Assistant registry APIs are available, cards identify entities from
the `yeelight_pro` platform and can auto-group same-device Yeelight Pro entities
into room, channel, strip, health, scene, panel, and device summaries. If the
registry cannot be read, configured `entities` still render normally.

## Development

```bash
npm install
npm run build
npm run lint
npm test
npm run test:browser
```

For a live Home Assistant validation:

```bash
HA_LIVE_URL=http://localhost:18124/yeelight-cards-live-validation/cards \
HA_LIVE_USERNAME=<username> \
HA_LIVE_PASSWORD=<password> \
npm run test:ha-live
```

## Boundaries

- This is a Lovelace frontend plugin, not a Home Assistant integration.
- It does not create entities, devices, automations, scenes, or services.
- It does not implement Yeelight cloud login, LAN control, private deployment,
  or push subscriptions.
- It avoids generic card replacement scope; standard HA Tile/Light cards remain
  the right default for basic entities.

## License

MIT License
