import type { PreferenceDefinition } from "./preferences";

export type Rgb = [number, number, number];

export type Xy = [number, number];

export const positionMax = 999;

export const colorPresets: { name: string; value: string }[] = [
  { name: "Red", value: "255 0 0" },
  { name: "Green", value: "0 255 0" },
  { name: "Lime", value: "150 255 0" },
  { name: "Blue", value: "0 0 255" },
  { name: "Cyan", value: "0 255 255" },
  { name: "Yellow", value: "255 215 0" },
  { name: "Orange", value: "255 165 0" },
  { name: "Purple", value: "128 0 128" },
  { name: "White", value: "255 255 255" },
  { name: "Black", value: "0 0 0" },
  { name: "Gray", value: "128 128 128" },
];

export const positionPresets: { name: string; value: string }[] = [
  { name: "Bottom", value: "-1 900" },
  { name: "Bottom left", value: "100 900" },
  { name: "Bottom right", value: "660 900" },
  { name: "Middle", value: "-1 700" },
  { name: "Middle left", value: "100 700" },
  { name: "Middle right", value: "660 700" },
  { name: "Top", value: "-1 100" },
  { name: "Top left", value: "100 100" },
  { name: "Top right", value: "660 100" },
];

const truthyValues = ["1", "on", "yes", "true", "enable", "enabled"];

function clamp(value: number, min: number, max: number) {
  const safeValue = Number.isFinite(value) ? value : min;
  const clamped = Math.min(Math.max(safeValue, min), max);

  return clamped;
}

function parseIntegers(value: string) {
  const parts = value.trim().split(/\s+/);
  const integers = parts.map((part) => Number.parseInt(part, 10));

  return integers;
}

export function parseRgb(value: string): Rgb {
  const [r = 0, g = 0, b = 0] = parseIntegers(value);
  const red = clamp(r, 0, 255);
  const green = clamp(g, 0, 255);
  const blue = clamp(b, 0, 255);

  return [red, green, blue];
}

export function formatRgb(rgb: Rgb) {
  const formatted = rgb.join(" ");

  return formatted;
}

export function parseXy(value: string): Xy {
  const [rawX = -1, rawY = -1] = parseIntegers(value);
  const x = clamp(rawX, -1, positionMax);
  const y = clamp(rawY, -1, positionMax);

  return [x, y];
}

export function formatXy(xy: Xy) {
  const formatted = xy.join(" ");

  return formatted;
}

function toHexPart(channel: number) {
  const hex = channel.toString(16).padStart(2, "0");

  return hex;
}

export function rgbToHex(rgb: Rgb) {
  const hex = rgb.map(toHexPart).join("");

  return `#${hex}`;
}

export function hexToRgb(hex: string): Rgb | null {
  const match = /^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(hex.trim());

  if (!match) {
    return null;
  }

  const [, r = "0", g = "0", b = "0"] = match;
  const red = Number.parseInt(r, 16);
  const green = Number.parseInt(g, 16);
  const blue = Number.parseInt(b, 16);

  return [red, green, blue];
}

export function rgbToCss(rgb: Rgb) {
  const [r, g, b] = rgb;

  return `rgb(${r} ${g} ${b})`;
}

function normalizeEnum(value: string, optionCount: number) {
  const parsed = Number.parseInt(value, 10);
  const clamped = clamp(parsed, 0, optionCount - 1);

  return String(clamped);
}

function normalizeBool(value: string) {
  const lowered = value.trim().toLowerCase();
  const isTruthy = truthyValues.includes(lowered);

  return isTruthy ? "1" : "0";
}

export function normalizeValue(
  definition: PreferenceDefinition,
  value: string,
) {
  if (definition.kind === "enum") {
    return normalizeEnum(value, definition.options.length);
  }

  if (definition.kind === "bool") {
    return normalizeBool(value);
  }

  if (definition.kind === "rgb") {
    const rgb = parseRgb(value);

    return formatRgb(rgb);
  }

  const xy = parseXy(value);

  return formatXy(xy);
}

export function findPresetName(
  presets: { name: string; value: string }[],
  value: string,
) {
  const preset = presets.find((candidate) => candidate.value === value);

  return preset?.name;
}
