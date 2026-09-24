import { decodeCode } from "./code";
import {
  definitions,
  findDefinition,
  getDefaultPreferences,
  type Preferences,
} from "./preferences";
import { normalizeValue } from "./values";

export const preferences: Preferences = $state(getDefaultPreferences());

export function applyPreferences(values: Preferences) {
  Object.assign(preferences, values);
}

export function resetPreferences() {
  const defaults = getDefaultPreferences();

  Object.assign(preferences, defaults);
}

export function serializeHash(values: Preferences) {
  const changed = definitions.filter(
    (definition) => values[definition.id] !== definition.defaultValue,
  );
  const entries = changed.map((definition) => [
    definition.id,
    values[definition.id] ?? "",
  ]);
  const params = new URLSearchParams(entries);
  const hash = params.toString();

  return hash;
}

function readHashParams(hash: string): Preferences {
  const params = new URLSearchParams(hash);
  const entries = [...params.entries()];

  const known = entries.flatMap(([id, value]) => {
    const definition = findDefinition(id);

    if (!definition) {
      return [];
    }

    const normalized = normalizeValue(definition, value);

    return [[id, normalized] as const];
  });

  return Object.fromEntries(known);
}

function readLegacyHash(hash: string): Preferences {
  try {
    const decoded = decodeURIComponent(hash);

    return decodeCode(decoded);
  } catch {
    return {};
  }
}

export function parseHash(rawHash: string): Preferences {
  const hash = rawHash.replace(/^#/, "");

  if (hash === "") {
    return {};
  }

  const values = readHashParams(hash);
  const hasValues = Object.keys(values).length > 0;

  if (hasValues) {
    return values;
  }

  return readLegacyHash(hash);
}

export function loadFromHash(rawHash: string) {
  const values = parseHash(rawHash);
  const defaults = getDefaultPreferences();

  Object.assign(preferences, defaults, values);
}
