<script lang="ts">
  import type { RgbDefinition } from "../lib/preferences";
  import { preferences } from "../lib/settings.svelte";
  import {
    colorPresets,
    findPresetName,
    formatRgb,
    hexToRgb,
    parseRgb,
    rgbToCss,
    rgbToHex,
  } from "../lib/values";

  type Props = {
    definition: RgbDefinition;
  };

  const { definition }: Props = $props();

  const value = $derived(preferences[definition.id] ?? "");
  const rgb = $derived(parseRgb(value));
  const hex = $derived(rgbToHex(rgb));
  const presetName = $derived(findPresetName(colorPresets, value) ?? "Custom");

  function setHex(nextHex: string) {
    const nextRgb = hexToRgb(nextHex);

    if (!nextRgb) {
      return;
    }

    preferences[definition.id] = formatRgb(nextRgb);
  }

  function setPreset(presetValue: string) {
    preferences[definition.id] = presetValue;
  }

  function onHexInput(event: Event & { currentTarget: HTMLInputElement }) {
    const nextHex = event.currentTarget.value;

    setHex(nextHex);
  }
</script>

<div class="flex flex-col gap-2">
  <div class="flex items-center gap-2">
    <label
      class="relative size-9 shrink-0 cursor-pointer overflow-hidden rounded-lg border border-zinc-700 shadow-inner"
      style:background-color={hex}
    >
      <span class="sr-only">Pick {definition.name}</span>
      <input
        type="color"
        value={hex}
        oninput={onHexInput}
        class="absolute inset-0 size-full cursor-pointer opacity-0"
      />
    </label>
    <input
      type="text"
      value={hex}
      onchange={onHexInput}
      spellcheck="false"
      aria-label="{definition.name} hex"
      class="w-24 rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 py-1.5 font-mono text-sm text-zinc-200 uppercase focus:border-violet-400 focus:outline-none"
    />
    <span class="font-mono text-xs text-zinc-500">{value}</span>
    <span class="ml-auto text-xs text-zinc-500">{presetName}</span>
  </div>
  <div class="flex flex-wrap gap-1.5">
    {#each colorPresets as preset (preset.value)}
      {@const presetRgb = parseRgb(preset.value)}
      <button
        type="button"
        title={preset.name}
        aria-label="Use {preset.name}"
        onclick={() => setPreset(preset.value)}
        class={[
          "size-5 rounded-md border transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400",
          preset.value === value
            ? "border-white ring-2 ring-violet-400/70"
            : "border-zinc-700",
        ]}
        style:background-color={rgbToCss(presetRgb)}
      ></button>
    {/each}
  </div>
</div>
