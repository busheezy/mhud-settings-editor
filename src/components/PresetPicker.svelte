<script lang="ts">
  import {
    getPresetPreferences,
    isPresetActive,
    presets,
    type Preset,
  } from "../lib/presets";
  import { applyPreferences, preferences } from "../lib/settings.svelte";

  type Props = {
    onapplied: (preset: Preset) => void;
  };

  const { onapplied }: Props = $props();

  function apply(preset: Preset) {
    const values = getPresetPreferences(preset);

    applyPreferences(values);
    onapplied(preset);
  }
</script>

<section class="rounded-2xl border border-zinc-800 bg-zinc-900/60">
  <div class="border-b border-zinc-800 px-5 py-4">
    <h2 class="text-base font-semibold text-zinc-100">Presets</h2>
    <p class="text-xs text-zinc-500">
      Start from a common layout, then tweak it below.
    </p>
  </div>
  <div class="grid gap-2 p-4 sm:grid-cols-2">
    {#each presets as preset (preset.name)}
      {@const isActive = isPresetActive(preferences, preset)}
      <button
        type="button"
        aria-pressed={isActive}
        onclick={() => apply(preset)}
        class={[
          "rounded-xl border px-3.5 py-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400",
          isActive
            ? "border-violet-400/60 bg-violet-500/15"
            : "border-zinc-800 bg-zinc-900 hover:border-zinc-700 hover:bg-zinc-800/60",
        ]}
      >
        <span
          class={[
            "block text-sm font-semibold",
            isActive ? "text-violet-100" : "text-zinc-100",
          ]}
        >
          {preset.name}
        </span>
        <span class="mt-0.5 block text-xs text-zinc-500"
          >{preset.description}</span
        >
      </button>
    {/each}
  </div>
</section>
