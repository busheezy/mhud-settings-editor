import { getBool, getInt, type Preferences } from "./preferences";
import type { Buttons, MovementFrame } from "./simulation";
import { parseRgb, parseXy, type Rgb, type Xy } from "./values";

export type HudElementId = "speed" | "keys" | "indicators";

export type HudElement = {
  id: HudElementId;
  text: string;
  rgb: Rgb;
  xy: Xy;
};

type KeyChar = "W" | "A" | "S" | "D" | "C" | "J" | "←" | "→";

type ColorPreferenceIds = {
  colorBy: string;
  normal: string;
  highlight: string;
  gain: string;
  loss: string;
};

const keysModeUnderscores = 1;

const keysModeNoBlanks = 2;

const spaceModeLegacy = 3;

const mouseStyleSide = 1;

const mouseStyleLine = 2;

const spacedKeys: Record<
  number,
  Record<KeyChar | "space" | "underscore", string>
> = {
  0: {
    space: "     ",
    underscore: "  —  ",
    W: " W ",
    A: "  A  ",
    S: "  S  ",
    D: "  D  ",
    C: "  C  ",
    J: "  J  ",
    "←": "  ← ",
    "→": " →  ",
  },
  1: {
    space: "     ",
    underscore: "  —  ",
    W: " W ",
    A: "  A  ",
    S: "  S  ",
    D: "  D  ",
    C: "  C  ",
    J: "  J  ",
    "←": "  ← ",
    "→": " →  ",
  },
  2: {
    space: "      ",
    underscore: " — ",
    W: " W ",
    A: " A ",
    S: "  S  ",
    D: "  D ",
    C: "  C  ",
    J: "  J  ",
    "←": "  ← ",
    "→": " →  ",
  },
};

function getColorBySpeed(speed: number): Rgb {
  const x = Math.round(speed / 50) * 32;

  if (x >= 256) {
    return [0, 255, 0];
  }

  return [255 - x, x, 0];
}

function lerpColor(from: Rgb, to: Rgb, t: number): Rgb {
  const [r, g, b] = from.map((channel, index) => {
    const target = to[index] ?? channel;

    return Math.round(channel * (1 - t) + target * t);
  });

  return [r ?? 0, g ?? 0, b ?? 0];
}

function getInstantGainColor(
  preferences: Preferences,
  frame: MovementFrame,
  ids: ColorPreferenceIds,
  fallback: Rgb,
) {
  const change = frame.speed - frame.oldSpeed;

  if (change > 0.1) {
    return parseRgb(preferences[ids.gain] ?? "");
  }

  if (change < -0.1) {
    return parseRgb(preferences[ids.loss] ?? "");
  }

  return fallback;
}

function countGainTicks(speedChanges: number[]) {
  const gains = speedChanges.filter((change) => change > 0.1).length;
  const losses = speedChanges.filter((change) => change < -0.1).length;

  return gains - losses;
}

function getAverageGainColor(
  preferences: Preferences,
  frame: MovementFrame,
  ids: ColorPreferenceIds,
  fallback: Rgb,
) {
  const gainTicks = countGainTicks(frame.speedChanges);
  const ratio = gainTicks / frame.speedChanges.length;

  if (gainTicks >= 0) {
    const gainColor = parseRgb(preferences[ids.gain] ?? "");

    return lerpColor(fallback, gainColor, ratio);
  }

  const lossColor = parseRgb(preferences[ids.loss] ?? "");

  return lerpColor(fallback, lossColor, -ratio);
}

function getElementColor(
  preferences: Preferences,
  frame: MovementFrame,
  ids: ColorPreferenceIds,
  isHighlighted: boolean,
) {
  const colorBy = getInt(preferences, ids.colorBy);
  const baseId = isHighlighted ? ids.highlight : ids.normal;
  const baseColor = parseRgb(preferences[baseId] ?? "");

  if (colorBy === 1) {
    return getColorBySpeed(frame.speed);
  }

  if (colorBy === 2) {
    return getInstantGainColor(preferences, frame, ids, baseColor);
  }

  if (colorBy === 3) {
    return getAverageGainColor(preferences, frame, ids, baseColor);
  }

  return baseColor;
}

function roundSpeed(speed: number, rounding: number) {
  if (rounding === 1) {
    return Math.round(speed);
  }

  if (rounding === 2) {
    return Math.ceil(speed);
  }

  const floored = Math.floor(speed);

  return speed - floored >= 0.999 ? floored + 1 : floored;
}

function shouldShowTakeoff(showTakeoff: number, frame: MovementFrame) {
  if (showTakeoff === 0 || !frame.didTakeoff) {
    return false;
  }

  if (showTakeoff === 1 && !frame.didJump) {
    return false;
  }

  return true;
}

function formatSpeed(speed: number, mode: number, rounding: number) {
  if (mode === 1) {
    return speed.toFixed(2);
  }

  const rounded = roundSpeed(speed, rounding);

  return String(rounded);
}

function buildSpeedElement(
  preferences: Preferences,
  frame: MovementFrame,
): HudElement | null {
  const mode = getInt(preferences, "speed_mode");

  if (mode === 0) {
    return null;
  }

  const rounding = getInt(preferences, "speed_rounding");
  const showTakeoff = getInt(preferences, "speed_takeoff");
  const speedText = formatSpeed(frame.speed, mode, rounding);
  const takeoffText = formatSpeed(frame.takeoffSpeed, mode, rounding);
  const hasTakeoff = shouldShowTakeoff(showTakeoff, frame);
  const text = hasTakeoff ? `${speedText}\n(${takeoffText})` : speedText;

  const ids: ColorPreferenceIds = {
    colorBy: "speed_color_by_speed",
    normal: "speed_color_normal",
    highlight: "speed_color_perf",
    gain: "speed_color_gain",
    loss: "speed_color_loss",
  };

  const rgb = getElementColor(preferences, frame, ids, frame.didPerf);
  const xy = parseXy(preferences.speed_position ?? "");

  return { id: "speed", text, rgb, xy };
}

function getKeyString(
  key: KeyChar,
  mode: number,
  spaceMode: number,
  pressed: boolean,
) {
  const spacing = spacedKeys[spaceMode];

  if (!spacing) {
    return "";
  }

  if (pressed) {
    return spacing[key];
  }

  if (mode === keysModeNoBlanks) {
    return spacing.space;
  }

  if (mode === keysModeUnderscores) {
    return spacing.underscore;
  }

  return "";
}

function didButtonsOverlap(buttons: Buttons) {
  const verticalOverlap = buttons.forward && buttons.back;
  const horizontalOverlap = buttons.left && buttons.right;

  return verticalOverlap || horizontalOverlap;
}

type KeyState = {
  crouch: boolean;
  forward: boolean;
  jump: boolean;
  left: boolean;
  back: boolean;
  right: boolean;
  mouseLeft: boolean;
  mouseRight: boolean;
};

function getKeyState(frame: MovementFrame): KeyState {
  const buttons = frame.buttons;

  return {
    crouch: buttons.duck,
    forward: buttons.forward,
    jump: frame.jumpedRecently,
    left: buttons.left,
    back: buttons.back,
    right: buttons.right,
    mouseLeft: frame.mouseX < 0,
    mouseRight: frame.mouseX > 0,
  };
}

type KeysContext = {
  state: KeyState;
  mode: number;
  spaceMode: number;
  mouseStyle: number;
  blank: string;
};

function simpleKey(key: KeyChar, pressed: boolean, blank: string) {
  return pressed ? key : blank;
}

function buildSimpleRows(context: KeysContext) {
  const { state, blank } = context;
  const c = simpleKey("C", state.crouch, blank);
  const w = simpleKey("W", state.forward, blank);
  const j = simpleKey("J", state.jump, blank);
  const a = simpleKey("A", state.left, blank);
  const s = simpleKey("S", state.back, blank);
  const d = simpleKey("D", state.right, blank);
  const arrowLeft = simpleKey("←", state.mouseLeft, blank);
  const arrowRight = simpleKey("→", state.mouseRight, blank);

  return { c, w, j, a, s, d, arrowLeft, arrowRight };
}

function buildSpacedRows(context: KeysContext) {
  const { state, mode, spaceMode } = context;
  const c = getKeyString("C", mode, spaceMode, state.crouch);
  const w = getKeyString("W", mode, spaceMode, state.forward);
  const j = getKeyString("J", mode, spaceMode, state.jump);
  const a = getKeyString("A", mode, spaceMode, state.left);
  const s = getKeyString("S", mode, spaceMode, state.back);
  const d = getKeyString("D", mode, spaceMode, state.right);
  const arrowLeft = getKeyString("←", mode, spaceMode, state.mouseLeft);
  const arrowRight = getKeyString("→", mode, spaceMode, state.mouseRight);

  return { c, w, j, a, s, d, arrowLeft, arrowRight };
}

function buildLegacyKeysText(context: KeysContext) {
  const simple = buildSimpleRows(context);

  if (context.mouseStyle === mouseStyleSide) {
    const spaced = buildSpacedRows(context);

    return `${spaced.c}${spaced.w}${spaced.j}\n${spaced.arrowLeft}${spaced.a}${spaced.s}${spaced.d}${spaced.arrowRight}`;
  }

  if (context.mouseStyle === mouseStyleLine) {
    const center = getKeyString(
      "J",
      keysModeNoBlanks,
      context.spaceMode,
      false,
    );

    return `${simple.c}${simple.w}${simple.j}\n${simple.arrowLeft}${center}${simple.arrowRight}\n${simple.a}${simple.s}${simple.d}`;
  }

  return `${simple.c}  ${simple.w}  ${simple.j}\n${simple.a}  ${simple.s}  ${simple.d}`;
}

function buildModernKeysText(context: KeysContext) {
  const spaced = buildSpacedRows(context);

  if (context.mouseStyle === mouseStyleSide) {
    const simple = buildSimpleRows(context);

    return `${simple.c}  ${simple.w}  ${simple.j}\n${simple.arrowLeft} ${simple.a}  ${simple.s}  ${simple.d} ${simple.arrowRight}`;
  }

  if (context.mouseStyle === mouseStyleLine) {
    const center = getKeyString(
      "J",
      keysModeNoBlanks,
      context.spaceMode,
      false,
    );

    return `${spaced.c}${spaced.w}${spaced.j}\n${spaced.arrowLeft}${center}${spaced.arrowRight}\n${spaced.a}${spaced.s}${spaced.d}`;
  }

  return `${spaced.c}${spaced.w}${spaced.j}\n${spaced.a}${spaced.s}${spaced.d}`;
}

function buildKeysElement(
  preferences: Preferences,
  frame: MovementFrame,
): HudElement | null {
  const mode = getInt(preferences, "keys_mode");

  if (mode === 0) {
    return null;
  }

  const spaceMode = getInt(preferences, "keys_spacing_mode");
  const mouseStyle = getInt(preferences, "keys_mouse_direction");
  const isLegacy = spaceMode === spaceModeLegacy;
  const blank = mode === keysModeNoBlanks ? "—" : "";
  const state = getKeyState(frame);

  const context: KeysContext = {
    state,
    mode,
    spaceMode,
    mouseStyle,
    blank,
  };

  const text = isLegacy
    ? buildLegacyKeysText(context)
    : buildModernKeysText(context);

  const ids: ColorPreferenceIds = {
    colorBy: "keys_color_by_speed",
    normal: "keys_color_normal",
    highlight: "keys_color_overlap",
    gain: "keys_color_gain",
    loss: "keys_color_loss",
  };

  const isOverlapping = didButtonsOverlap(frame.buttons);
  const rgb = getElementColor(preferences, frame, ids, isOverlapping);
  const xy = parseXy(preferences.keys_position ?? "");

  return { id: "keys", text, rgb, xy };
}

function getIndicatorLabels(preferences: Preferences, frame: MovementFrame) {
  const useAbbreviations = getBool(preferences, "indicators_abbrs");

  const indicators = [
    {
      id: "indicators_jb_enabled",
      active: frame.didJumpBug,
      short: "JB",
      long: "JUMPBUG",
    },
    {
      id: "indicators_cj_enabled",
      active: frame.didCrouchJump,
      short: "CJ",
      long: "CROUCH JUMP",
    },
    {
      id: "indicators_pb_enabled",
      active: frame.didPerf,
      short: "PERF",
      long: "PERFECT BHOP",
    },
    {
      id: "indicators_ftg",
      active: frame.firstTickGain,
      short: "G",
      long: "FIRST TICK GAIN",
    },
  ];

  const labels = indicators
    .filter(
      (indicator) => indicator.active && getBool(preferences, indicator.id),
    )
    .map((indicator) => (useAbbreviations ? indicator.short : indicator.long));

  return labels;
}

function buildIndicatorsElement(
  preferences: Preferences,
  frame: MovementFrame,
): HudElement | null {
  const isEnabled = getBool(preferences, "indicators_mode");

  if (!isEnabled) {
    return null;
  }

  const labels = getIndicatorLabels(preferences, frame);

  if (labels.length === 0) {
    return null;
  }

  const text = labels.join("\n");
  const rgb = parseRgb(preferences.indicators_color ?? "");
  const xy = parseXy(preferences.indicators_position ?? "");

  return { id: "indicators", text, rgb, xy };
}

export function buildHud(preferences: Preferences, frame: MovementFrame) {
  const speed = buildSpeedElement(preferences, frame);
  const keys = buildKeysElement(preferences, frame);
  const indicators = buildIndicatorsElement(preferences, frame);
  const elements = [speed, keys, indicators].filter(
    (element) => element !== null,
  );

  return elements;
}
