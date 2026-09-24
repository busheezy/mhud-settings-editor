import {
  codeOrder,
  definitions,
  findDefinition,
  type Preferences,
} from "./preferences";
import { normalizeValue } from "./values";

export const currentRevision = 3;

export const importCommand = "sm_mhud_import";

export const maxLineLength = 255;

const importPrefixLength = importCommand.length + 1;

export const maxCodeLength = maxLineLength - importPrefixLength;

const importPrefixPattern = /^\s*sm_mhud_(settings_|preferences_)?import\s+/i;

const commandLinePattern = /^\s*sm_mhud_([a-z_]+)\s+set\s+(.+?)\s*$/i;

type DecodedCode = {
  rev: number;
  data: string[];
};

export type ExportPlan = {
  code: string;
  codeIds: string[];
  commandIds: string[];
};

function encodeBase64(text: string) {
  const bytes = new TextEncoder().encode(text);
  const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join(
    "",
  );
  const encoded = btoa(binary);

  return encoded;
}

function decodeBase64(encoded: string) {
  const binary = atob(encoded);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  const text = new TextDecoder().decode(bytes);

  return text;
}

function buildCode(preferences: Preferences, ids: string[]) {
  const data = ids.map((id) => preferences[id] ?? "");

  const payload = {
    rev: currentRevision,
    data,
  };

  const json = JSON.stringify(payload);
  const code = encodeBase64(json);

  return code;
}

function findFittingCount(preferences: Preferences) {
  const counts = codeOrder.map((_, index) => codeOrder.length - index);

  const fittingCount = counts.find((count) => {
    const ids = codeOrder.slice(0, count);
    const code = buildCode(preferences, ids);

    return code.length <= maxCodeLength;
  });

  return fittingCount ?? 0;
}

export function planExport(preferences: Preferences): ExportPlan {
  const fittingCount = findFittingCount(preferences);
  const codeIds = codeOrder.slice(0, fittingCount);
  const code = buildCode(preferences, codeIds);

  const commandIds = definitions
    .map((definition) => definition.id)
    .filter((id) => !codeIds.includes(id));

  return {
    code,
    codeIds,
    commandIds,
  };
}

export function buildSetCommand(preferences: Preferences, id: string) {
  const value = preferences[id] ?? "";

  return `sm_mhud_${id} set ${value}`;
}

export function buildConfig(preferences: Preferences, ids: string[]) {
  const lines = ids.map((id) => buildSetCommand(preferences, id));
  const config = lines.join("\n");

  return config;
}

function isDecodedCode(value: unknown): value is DecodedCode {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  const hasRevision = typeof candidate.rev === "number";
  const hasData = Array.isArray(candidate.data);

  return hasRevision && hasData;
}

function transformOldPosition(value: string) {
  const [rawX = "-1", rawY = "-1"] = value.trim().split(/\s+/);
  const x = Number.parseFloat(rawX);
  const y = Number.parseFloat(rawY);

  const convertedX = Math.abs(x + 1) < 0.001 ? -1 : Math.round(x * 1000);
  const convertedY = Math.abs(y + 1) < 0.001 ? -1 : Math.round(y * 1000);

  return `${convertedX} ${convertedY}`;
}

function readCodeValue(decoded: DecodedCode, index: number) {
  const id = codeOrder[index];
  const rawValue = decoded.data[index];

  if (id === undefined || typeof rawValue !== "string") {
    throw new Error("The code contains an invalid value.");
  }

  const definition = findDefinition(id);

  if (!definition) {
    throw new Error("The code contains an unknown setting.");
  }

  const isOldPosition = decoded.rev <= 2 && definition.kind === "xy";
  const value = isOldPosition ? transformOldPosition(rawValue) : rawValue;
  const normalized = normalizeValue(definition, value);

  return [id, normalized] as const;
}

function parseCode(code: string) {
  const json = decodeBase64(code);
  const parsed: unknown = JSON.parse(json);

  return parsed;
}

export function decodeCode(input: string): Preferences {
  const code = input.replace(importPrefixPattern, "").trim();

  if (code === "") {
    throw new Error("Paste a code first.");
  }

  const decoded = tryParseCode(code);

  if (!isDecodedCode(decoded)) {
    throw new Error("That does not look like a MovementHUD code.");
  }

  if (decoded.rev <= 0 || decoded.rev > currentRevision) {
    throw new Error(`Unsupported code revision ${decoded.rev}.`);
  }

  const count = Math.min(decoded.data.length, codeOrder.length);
  const indexes = Array.from({ length: count }, (_, index) => index);
  const entries = indexes.map((index) => readCodeValue(decoded, index));
  const preferences = Object.fromEntries(entries);

  return preferences;
}

function tryParseCode(code: string) {
  try {
    return parseCode(code);
  } catch {
    throw new Error("That code could not be decoded.");
  }
}

function parseCommandLine(line: string) {
  const match = commandLinePattern.exec(line);

  if (!match) {
    return null;
  }

  const [, id = "", value = ""] = match;
  const definition = findDefinition(id.toLowerCase());

  if (!definition) {
    return null;
  }

  const normalized = normalizeValue(definition, value);

  return [definition.id, normalized] as const;
}

function decodeCommandLines(input: string): Preferences {
  const lines = input.split(/[\n;]/);
  const entries = lines.map(parseCommandLine).filter((entry) => entry !== null);
  const preferences = Object.fromEntries(entries);

  return preferences;
}

function decodeLine(line: string): Preferences {
  const isImport = importPrefixPattern.test(line);

  if (isImport) {
    return decodeCode(line);
  }

  return decodeCommandLines(line);
}

export function decodeInput(input: string): Preferences {
  const lines = input
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "");

  const hasCommands = lines.some((line) =>
    line.toLowerCase().startsWith("sm_mhud_"),
  );

  if (!hasCommands) {
    return decodeCode(input);
  }

  const decodedLines = lines.map(decodeLine);
  const preferences = Object.assign({}, ...decodedLines) as Preferences;
  const hasValues = Object.keys(preferences).length > 0;

  if (!hasValues) {
    throw new Error("No MovementHUD settings were found in that text.");
  }

  return preferences;
}
