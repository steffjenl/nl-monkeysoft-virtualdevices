# Flow cards

All cards are device-scoped (defined in `driver.flow.compose.json`, so Homey adds the device selector automatically). Trigger tokens: `value` (new value) and `previous` (previous value), typed per driver.

## Virtual Switch (`virtual-boolean`)

| Type      | Id                | Card                          | Notes                             |
| --------- | ----------------- | ----------------------------- | --------------------------------- |
| Trigger   | `boolean_changed` | The value changed             | tokens: value, previous (boolean) |
| Condition | `boolean_is_true` | The value is true             | invertible                        |
| Action    | `boolean_set`     | Set the value to [true/false] | dropdown argument                 |

Plus Homey's built-in `onoff` cards (turned on/off, is on, turn on/off).

## Virtual Button (`virtual-button`)

| Type      | Id                  | Card                              |
| --------- | ------------------- | --------------------------------- |
| Trigger   | `button_turned_on`  | Turned on                         |
| Trigger   | `button_turned_off` | Turned off                        |
| Trigger   | `button_toggled`    | Toggled (tokens: value, previous) |
| Condition | `button_is_on`      | Is turned on (invertible)         |
| Action    | `button_turn_on`    | Turn on                           |
| Action    | `button_turn_off`   | Turn off                          |
| Action    | `button_toggle`     | Toggle                            |

## Virtual Number (`virtual-number`)

| Type      | Id                | Card                                 | Notes                                           |
| --------- | ----------------- | ------------------------------------ | ----------------------------------------------- |
| Trigger   | `number_changed`  | The value changed                    | tokens: value, previous (number)                |
| Condition | `number_in_range` | The value is between [min] and [max] | inclusive, invertible                           |
| Action    | `number_set`      | Set the value to [value]             | rounded to decimals; clamped when range enabled |

Device settings: decimals (0–6, default 2), unit (free text), limit range (checkbox, default off), minimum (default 0), maximum (default 100). Unit and decimals are applied to the capability display via `setCapabilityOptions()`.

## Virtual Text (`virtual-string`)

| Type      | Id              | Card                         | Notes                                  |
| --------- | --------------- | ---------------------------- | -------------------------------------- |
| Trigger   | `text_changed`  | The text changed             | tokens: value, previous (string)       |
| Condition | `text_equals`   | The text is equal to [value] | invertible                             |
| Condition | `text_contains` | The text contains [value]    | invertible; empty search never matches |
| Action    | `text_set`      | Set the text to [value]      |                                        |

Comparisons are **case-insensitive by default**; the per-device setting "Case-sensitive comparisons" switches both conditions to exact case matching.

## Numeric sensors: Temperature / Power / Battery / Humidity / Luminance / Pressure / CO2

Identical pattern per driver (`temperature_*`, `power_*`, `battery_*`, `humidity_*`, `luminance_*`, `pressure_*`, `co2_*`):

| Type      | Card                       | Notes                                              |
| --------- | -------------------------- | -------------------------------------------------- |
| Trigger   | The value changed          | typed tokens (°C / W / % / lx / mbar / ppm)        |
| Condition | Is between [min] and [max] | inclusive, invertible                              |
| Action    | Set to [value]             | clamps: battery & humidity 0–100; lux/mbar/ppm ≥ 0 |

Plus Homey's built-in cards for the standard `measure_*` capabilities.

## Virtual Contact (`virtual-contact`)

| Type      | Id                | Card                 |
| --------- | ----------------- | -------------------- |
| Trigger   | `contact_opened`  | Opened               |
| Trigger   | `contact_closed`  | Closed               |
| Condition | `contact_is_open` | Is open (invertible) |
| Action    | `contact_open`    | Set open             |
| Action    | `contact_close`   | Set closed           |

## Virtual Motion (`virtual-motion`)

| Type      | Id                 | Card                            |
| --------- | ------------------ | ------------------------------- |
| Trigger   | `motion_started`   | Motion started                  |
| Trigger   | `motion_ended`     | Motion ended                    |
| Condition | `motion_is_active` | Motion is detected (invertible) |
| Action    | `motion_start`     | Start motion                    |
| Action    | `motion_stop`      | Stop motion                     |

Both also expose Homey's built-in `alarm_contact`/`alarm_motion` cards.

## Virtual Dimmer (`virtual-dimmer`)

| Type      | Id                | Card                                         | Notes                      |
| --------- | ----------------- | -------------------------------------------- | -------------------------- |
| Trigger   | `dimmer_changed`  | The dim level changed                        | tokens value/previous in % |
| Condition | `dimmer_in_range` | The dim level is between [min] % and [max] % | inclusive, invertible      |
| Action    | `dimmer_set`      | Set the dim level to [value] %               | stored as 0–1 on `dim`     |

The `dim` capability stores 0–1; all cards convert to/from percentages. Setting the dim level also syncs `onoff` (>0 % = on). Homey's built-in `dim`/`onoff` cards remain available.

## Virtual Energy Meter (`virtual-energy`)

| Type      | Id                | Card                                  | Notes                  |
| --------- | ----------------- | ------------------------------------- | ---------------------- |
| Trigger   | `energy_changed`  | The energy meter changed              | tokens in kWh          |
| Condition | `energy_in_range` | The meter value is between two values | inclusive              |
| Action    | `energy_set`      | Set the meter to [value] kWh          | clamped ≥ 0            |
| Action    | `energy_add`      | Add [value] kWh to the meter          | increments; ≥ 0 result |

## Robustness rules

- Numeric condition/action arguments are parsed defensively (`parseNumber`); anything non-finite fails the condition (returns false) or rejects the action with a localized error.
- Swapped min/max bounds are treated as the equivalent valid range.
- Triggers only fire when the value actually changed (old `!==` new).
- Trigger failures are logged, never propagated into the value update.
