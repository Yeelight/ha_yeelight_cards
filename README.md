# Yeelight Cards

Home Assistant native Lovelace cards for Yeelight lighting experiences.

This rebuild intentionally starts from a clean plugin shape:

- card picker metadata through `window.customCards`
- HA visual editor through static card-class `getConfigElement`
- synchronous `getStubConfig` and `getEntitySuggestion`
- Chinese and English UI labels following the Home Assistant frontend locale
- standard HA services only
- `ha-card` shell and Home Assistant theme variables

## Cards

- `custom:yeelight-light-card`
- `custom:yeelight-room-card`
- `custom:yeelight-scene-card`
- `custom:yeelight-strip-card`
- `custom:yeelight-health-card`
- `custom:yeelight-channel-card`
- `custom:yeelight-panel-card`
- `custom:yeelight-device-card`

This package is a Yeelight Card Pack, not a generic replacement for Home Assistant cards. Basic lights and switches should still work well with HA Tile/Light cards; these cards focus on Yeelight lighting layers, room control, scenes/effects, strips, panels, and diagnostics.

## Install

Copy `dist/ha_yeelight_cards.js` to Home Assistant:

```yaml
resources:
  - url: /local/ha_yeelight_cards/ha_yeelight_cards.js
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

The visual editor exposes the same kind of native fields as built-in Home Assistant cards: entity, name, icon, layout, primary/secondary info, visibility toggles, and tap/hold/double-tap actions. Runtime Yeelight grouping only uses HA entity state plus the entity/device registry already visible to the frontend. Control still uses Home Assistant entities, states, attributes, and standard services.

## Reference Boundaries

The architecture follows established Home Assistant custom-card conventions seen in Mushroom, Bubble Card, Button Card, ApexCharts Card, mini-graph-card, simple-thermostat, and slider-entity-row. Their code and copy are not vendored.
