import { getBool, getInt, type Preferences } from "./preferences";
import type { Buttons, MovementFrame } from "./simulation";
import { parseRgb, parseXy, type Rgb, type Xy } from "./values";

export type HudElementId = "speed" | "keys" | "indicators";

export type HudElement = {
  id: HudElementId;
  rows: string[][];
  isGrid: boolean;
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

const mouseStyleSide = 1;

const mouseStyleLine = 2;

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
  const rows = hasTakeoff ? [[speedText], [`(${takeoffText})`]] : [[speedText]];

  const ids: ColorPreferenceIds = {
    colorBy: "speed_color_by_speed",
    normal: "speed_color_normal",
    highlight: "speed_color_perf",
    gain: "speed_color_gain",
    loss: "speed_color_loss",
  };

  const rgb = getElementColor(preferences, frame, ids, frame.didPerf);
  const xy = parseXy(preferences.speed_position ?? "");

  return { id: "speed", rows, isGrid: false, rgb, xy };
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

function keyCell(key: KeyChar, pressed: boolean, blank: string) {
  return pressed ? key : blank;
}

function buildKeyRows(state: KeyState, mouseStyle: number, blank: string) {
  const c = keyCell("C", state.crouch, blank);
  const w = keyCell("W", state.forward, blank);
  const j = keyCell("J", state.jump, blank);
  const a = keyCell("A", state.left, blank);
  const s = keyCell("S", state.back, blank);
  const d = keyCell("D", state.right, blank);
  const arrowLeft = keyCell("←", state.mouseLeft, blank);
  const arrowRight = keyCell("→", state.mouseRight, blank);

  if (mouseStyle === mouseStyleSide) {
    return [
      [c, w, j],
      [arrowLeft, a, s, d, arrowRight],
    ];
  }

  if (mouseStyle === mouseStyleLine) {
    return [
      [c, w, j],
      [arrowLeft, "", arrowRight],
      [a, s, d],
    ];
  }

  return [
    [c, w, j],
    [a, s, d],
  ];
}

function buildKeysElement(
  preferences: Preferences,
  frame: MovementFrame,
): HudElement | null {
  const mode = getInt(preferences, "keys_mode");

  if (mode === 0) {
    return null;
  }

  const mouseStyle = getInt(preferences, "keys_mouse_direction");
  const blank = mode === keysModeUnderscores ? "—" : "";
  const state = getKeyState(frame);
  const rows = buildKeyRows(state, mouseStyle, blank);

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

  return { id: "keys", rows, isGrid: true, rgb, xy };
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

  const rows = labels.map((label) => [label]);
  const rgb = parseRgb(preferences.indicators_color ?? "");
  const xy = parseXy(preferences.indicators_position ?? "");

  return { id: "indicators", rows, isGrid: false, rgb, xy };
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
