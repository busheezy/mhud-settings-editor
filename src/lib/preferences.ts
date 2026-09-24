export type PreferenceGroup = "speed" | "keys" | "indicators" | "general";

type BaseDefinition = {
  id: string;
  name: string;
  group: PreferenceGroup;
  description: string;
  defaultValue: string;
};

export type EnumDefinition = BaseDefinition & {
  kind: "enum";
  options: string[];
};

export type BoolDefinition = BaseDefinition & {
  kind: "bool";
};

export type RgbDefinition = BaseDefinition & {
  kind: "rgb";
};

export type XyDefinition = BaseDefinition & {
  kind: "xy";
};

export type PreferenceDefinition =
  EnumDefinition | BoolDefinition | RgbDefinition | XyDefinition;

export type Preferences = Record<string, string>;

const colorByOptions = [
  "Disabled",
  "Color by current speed",
  "Color by gain (instant)",
  "Color by gain (average)",
];

export const definitions: PreferenceDefinition[] = [
  {
    id: "speed_mode",
    name: "Mode",
    group: "speed",
    kind: "enum",
    options: ["Disabled", "As decimal", "As whole number"],
    defaultValue: "0",
    description: "How your current speed is displayed.",
  },
  {
    id: "speed_position",
    name: "Position",
    group: "speed",
    kind: "xy",
    defaultValue: "-1 725",
    description: "Where the speed display is drawn on screen.",
  },
  {
    id: "speed_rounding",
    name: "Rounding",
    group: "speed",
    kind: "enum",
    options: ["Round down", "Round to nearest", "Round up"],
    defaultValue: "0",
    description: "How speed is rounded when shown as a whole number.",
  },
  {
    id: "speed_takeoff",
    name: "Show takeoff",
    group: "speed",
    kind: "enum",
    options: ["Disabled", "Jumps only", "Enabled"],
    defaultValue: "1",
    description:
      "Show your takeoff speed under your current speed while in the air.",
  },
  {
    id: "speed_color_by_speed",
    name: "Color by speed",
    group: "speed",
    kind: "enum",
    options: colorByOptions,
    defaultValue: "0",
    description:
      "Tint the speed display based on how fast you are or whether you are gaining speed.",
  },
  {
    id: "speed_color_normal",
    name: "Normal color",
    group: "speed",
    kind: "rgb",
    defaultValue: "255 255 255",
    description: "Default speed color.",
  },
  {
    id: "speed_color_perf",
    name: "Perfect bhop color",
    group: "speed",
    kind: "rgb",
    defaultValue: "0 255 0",
    description: "Speed color after a perfect bunnyhop.",
  },
  {
    id: "speed_color_gain",
    name: "Gain color",
    group: "speed",
    kind: "rgb",
    defaultValue: "0 255 0",
    description:
      "Speed color while gaining speed. Used by the gain color modes.",
  },
  {
    id: "speed_color_loss",
    name: "Loss color",
    group: "speed",
    kind: "rgb",
    defaultValue: "255 0 0",
    description:
      "Speed color while losing speed. Used by the gain color modes.",
  },
  {
    id: "keys_mode",
    name: "Mode",
    group: "keys",
    kind: "enum",
    options: ["Disabled", "Blanks as underscores", "Blanks invisible"],
    defaultValue: "0",
    description: "How the pressed keys are displayed.",
  },
  {
    id: "keys_position",
    name: "Position",
    group: "keys",
    kind: "xy",
    defaultValue: "-1 800",
    description: "Where the keys display is drawn on screen.",
  },
  {
    id: "keys_spacing_mode",
    name: "Spacing mode",
    group: "keys",
    kind: "enum",
    options: ["1080p FS", "1440p resized", "1440p native", "Legacy"],
    defaultValue: "0",
    description:
      "Spacing tuned for your resolution so the keys do not shift around in game. The preview always shows evenly spaced keys.",
  },
  {
    id: "keys_mouse_direction",
    name: "Mouse direction",
    group: "keys",
    kind: "enum",
    options: ["Disabled", "Style 1", "Style 2"],
    defaultValue: "0",
    description: "Show arrows for the direction your mouse is moving.",
  },
  {
    id: "keys_color_by_speed",
    name: "Color by speed",
    group: "keys",
    kind: "enum",
    options: colorByOptions,
    defaultValue: "0",
    description:
      "Tint the keys based on how fast you are or whether you are gaining speed.",
  },
  {
    id: "keys_color_normal",
    name: "Normal color",
    group: "keys",
    kind: "rgb",
    defaultValue: "255 255 255",
    description: "Default keys color.",
  },
  {
    id: "keys_color_overlap",
    name: "Overlap color",
    group: "keys",
    kind: "rgb",
    defaultValue: "255 0 0",
    description: "Keys color while opposite keys are held at the same time.",
  },
  {
    id: "keys_color_gain",
    name: "Gain color",
    group: "keys",
    kind: "rgb",
    defaultValue: "0 255 0",
    description:
      "Keys color while gaining speed. Used by the gain color modes.",
  },
  {
    id: "keys_color_loss",
    name: "Loss color",
    group: "keys",
    kind: "rgb",
    defaultValue: "255 0 0",
    description: "Keys color while losing speed. Used by the gain color modes.",
  },
  {
    id: "indicators_mode",
    name: "Enabled",
    group: "indicators",
    kind: "bool",
    defaultValue: "1",
    description: "Show indicators for movement techniques.",
  },
  {
    id: "indicators_position",
    name: "Position",
    group: "indicators",
    kind: "xy",
    defaultValue: "550 725",
    description: "Where the indicators are drawn on screen.",
  },
  {
    id: "indicators_color",
    name: "Color",
    group: "indicators",
    kind: "rgb",
    defaultValue: "0 255 0",
    description: "Indicator text color.",
  },
  {
    id: "indicators_abbrs",
    name: "Abbreviations",
    group: "indicators",
    kind: "bool",
    defaultValue: "1",
    description: "Use short names such as JB and CJ.",
  },
  {
    id: "indicators_jb_enabled",
    name: "Jump bug",
    group: "indicators",
    kind: "bool",
    defaultValue: "0",
    description: "Show an indicator after a jump bug.",
  },
  {
    id: "indicators_cj_enabled",
    name: "Crouch jump",
    group: "indicators",
    kind: "bool",
    defaultValue: "0",
    description: "Show an indicator after a crouch jump.",
  },
  {
    id: "indicators_pb_enabled",
    name: "Perfect bhop",
    group: "indicators",
    kind: "bool",
    defaultValue: "0",
    description: "Show an indicator after a perfect bunnyhop.",
  },
  {
    id: "indicators_ftg",
    name: "First tick gain",
    group: "indicators",
    kind: "bool",
    defaultValue: "0",
    description:
      "Show an indicator when you gain speed on the first tick of a strafe.",
  },
  {
    id: "update_speed",
    name: "Update speed",
    group: "general",
    kind: "enum",
    options: ["Fastest", "Fast", "Normal", "Slow", "Slowest"],
    defaultValue: "0",
    description:
      "How often the HUD is redrawn. Slower settings reduce flicker at the cost of responsiveness.",
  },
];

export const codeOrder = [
  "speed_mode",
  "speed_position",
  "speed_color_normal",
  "speed_color_perf",
  "keys_mode",
  "keys_position",
  "keys_color_normal",
  "keys_color_overlap",
  "keys_mouse_direction",
  "speed_takeoff",
  "speed_color_by_speed",
  "keys_color_by_speed",
  "indicators_color",
  "indicators_position",
  "indicators_jb_enabled",
  "indicators_cj_enabled",
  "indicators_pb_enabled",
  "speed_rounding",
  "speed_color_gain",
  "speed_color_loss",
  "indicators_ftg",
  "keys_color_gain",
  "keys_color_loss",
  "indicators_mode",
];

const definitionMap = new Map(
  definitions.map((definition) => [definition.id, definition]),
);

export function findDefinition(id: string) {
  const definition = definitionMap.get(id);

  return definition;
}

export function getDefinitionsByGroup(group: PreferenceGroup) {
  const groupDefinitions = definitions.filter(
    (definition) => definition.group === group,
  );

  return groupDefinitions;
}

export function getDefaultPreferences(): Preferences {
  const entries = definitions.map((definition) => [
    definition.id,
    definition.defaultValue,
  ]);
  const preferences = Object.fromEntries(entries);

  return preferences;
}

export function isDefault(preferences: Preferences, id: string) {
  const definition = definitionMap.get(id);
  const value = preferences[id];

  return definition?.defaultValue === value;
}

export function getInt(preferences: Preferences, id: string) {
  const value = preferences[id] ?? "0";
  const parsed = Number.parseInt(value, 10);

  return parsed;
}

export function getBool(preferences: Preferences, id: string) {
  const value = preferences[id];

  return value === "1";
}

function hasColorBy(preferences: Preferences, id: string, modes: number[]) {
  const colorBy = getInt(preferences, id);

  return modes.includes(colorBy);
}

type ActiveRule = (preferences: Preferences) => boolean;

const isSpeedEnabled: ActiveRule = (preferences) =>
  getInt(preferences, "speed_mode") !== 0;

const isSpeedRounded: ActiveRule = (preferences) =>
  getInt(preferences, "speed_mode") === 2;

const usesSpeedBaseColors: ActiveRule = (preferences) =>
  isSpeedEnabled(preferences) &&
  hasColorBy(preferences, "speed_color_by_speed", [0, 2, 3]);

const usesSpeedGainColors: ActiveRule = (preferences) =>
  isSpeedEnabled(preferences) &&
  hasColorBy(preferences, "speed_color_by_speed", [2, 3]);

const isKeysEnabled: ActiveRule = (preferences) =>
  getInt(preferences, "keys_mode") !== 0;

const usesKeysBaseColors: ActiveRule = (preferences) =>
  isKeysEnabled(preferences) &&
  hasColorBy(preferences, "keys_color_by_speed", [0, 2, 3]);

const usesKeysGainColors: ActiveRule = (preferences) =>
  isKeysEnabled(preferences) &&
  hasColorBy(preferences, "keys_color_by_speed", [2, 3]);

const isIndicatorsEnabled: ActiveRule = (preferences) =>
  getBool(preferences, "indicators_mode");

const activeRules: Record<string, ActiveRule> = {
  speed_position: isSpeedEnabled,
  speed_rounding: isSpeedRounded,
  speed_takeoff: isSpeedEnabled,
  speed_color_by_speed: isSpeedEnabled,
  speed_color_normal: usesSpeedBaseColors,
  speed_color_perf: usesSpeedBaseColors,
  speed_color_gain: usesSpeedGainColors,
  speed_color_loss: usesSpeedGainColors,
  keys_position: isKeysEnabled,
  keys_spacing_mode: isKeysEnabled,
  keys_mouse_direction: isKeysEnabled,
  keys_color_by_speed: isKeysEnabled,
  keys_color_normal: usesKeysBaseColors,
  keys_color_overlap: usesKeysBaseColors,
  keys_color_gain: usesKeysGainColors,
  keys_color_loss: usesKeysGainColors,
  indicators_position: isIndicatorsEnabled,
  indicators_color: isIndicatorsEnabled,
  indicators_abbrs: isIndicatorsEnabled,
  indicators_jb_enabled: isIndicatorsEnabled,
  indicators_cj_enabled: isIndicatorsEnabled,
  indicators_pb_enabled: isIndicatorsEnabled,
  indicators_ftg: isIndicatorsEnabled,
};

export function isPreferenceActive(preferences: Preferences, id: string) {
  const rule = activeRules[id];

  if (!rule) {
    return true;
  }

  return rule(preferences);
}
