import {
  definitions,
  getDefaultPreferences,
  type Preferences,
} from "./preferences";

export type Preset = {
  name: string;
  description: string;
  values: Preferences;
};

export const presets: Preset[] = [
  {
    name: "BuSheeZy",
    description: "The layout from the original version of this editor.",
    values: {
      speed_mode: "1",
      speed_position: "-1 700",
      keys_mode: "1",
      keys_position: "-1 800",
    },
  },
  {
    name: "Minimal",
    description: "Only your speed, as a whole number.",
    values: {
      speed_mode: "2",
      speed_takeoff: "0",
    },
  },
  {
    name: "Classic",
    description: "Decimal speed with takeoff, keys, and a PERF indicator.",
    values: {
      speed_mode: "1",
      keys_mode: "1",
      indicators_pb_enabled: "1",
    },
  },
  {
    name: "Strafe trainer",
    description: "Speed and keys colored by gain, with mouse direction.",
    values: {
      speed_mode: "2",
      speed_color_by_speed: "3",
      keys_mode: "1",
      keys_mouse_direction: "1",
      keys_color_by_speed: "2",
      indicators_pb_enabled: "1",
      indicators_ftg: "1",
    },
  },
  {
    name: "Everything",
    description: "Every element and indicator turned on.",
    values: {
      speed_mode: "1",
      speed_takeoff: "2",
      speed_color_by_speed: "1",
      keys_mode: "1",
      keys_mouse_direction: "2",
      indicators_abbrs: "0",
      indicators_jb_enabled: "1",
      indicators_cj_enabled: "1",
      indicators_pb_enabled: "1",
      indicators_ftg: "1",
    },
  },
];

export function getPresetPreferences(preset: Preset): Preferences {
  const defaults = getDefaultPreferences();
  const preferences = { ...defaults, ...preset.values };

  return preferences;
}

export function isPresetActive(preferences: Preferences, preset: Preset) {
  const presetPreferences = getPresetPreferences(preset);

  const matches = definitions.every(
    (definition) =>
      preferences[definition.id] === presetPreferences[definition.id],
  );

  return matches;
}
