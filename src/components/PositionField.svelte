<script lang="ts">
  import type { XyDefinition } from "../lib/preferences";
  import { preferences } from "../lib/settings.svelte";
  import {
    findPresetName,
    formatXy,
    parseXy,
    positionMax,
    positionPresets,
  } from "../lib/values";

  type Props = {
    definition: XyDefinition;
  };

  const { definition }: Props = $props();

  const value = $derived(preferences[definition.id] ?? "");
  const xy = $derived(parseXy(value));
  const presetValue = $derived(
    findPresetName(positionPresets, value) ? value : "",
  );

  const axes = [
    { index: 0, label: "X", centerLabel: "Center horizontally", fallback: 500 },
    { index: 1, label: "Y", centerLabel: "Center vertically", fallback: 500 },
  ] as const;

  function setAxis(index: 0 | 1, axisValue: number) {
    const next = [...xy] as [number, number];
    const safeValue = Number.isFinite(axisValue) ? Math.round(axisValue) : 0;
    const clamped = Math.min(Math.max(safeValue, 0), positionMax);

    next[index] = clamped;
    preferences[definition.id] = formatXy(next);
  }

  function setCentered(index: 0 | 1, isCentered: boolean, fallback: number) {
    const next = [...xy] as [number, number];

    next[index] = isCentered ? -1 : fallback;
    preferences[definition.id] = formatXy(next);
  }

  function onPresetChange(event: Event & { currentTarget: HTMLSelectElement }) {
    const nextValue = event.currentTarget.value;

    if (nextValue === "") {
      return;
    }

    preferences[definition.id] = nextValue;
  }
</script>

<div class="flex flex-col gap-3">
  <select
    value={presetValue}
    onchange={onPresetChange}
    aria-label="{definition.name} preset"
    class="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 py-1.5 text-sm text-zinc-200 focus:border-violet-400 focus:outline-none sm:w-56"
  >
    <option value="">Custom</option>
    {#each positionPresets as preset (preset.value)}
      <option value={preset.value}>{preset.name}</option>
    {/each}
  </select>

  {#each axes as axis (axis.index)}
    {@const axisValue = xy[axis.index]}
    {@const isCentered = axisValue === -1}
    <div
      class="grid grid-cols-[1.25rem_minmax(0,1fr)_4.5rem] items-center gap-3"
    >
      <span class="font-mono text-xs font-semibold text-zinc-500"
        >{axis.label}</span
      >
      <input
        type="range"
        min="0"
        max={positionMax}
        value={isCentered ? 500 : axisValue}
        disabled={isCentered}
        oninput={(event) =>
          setAxis(axis.index, event.currentTarget.valueAsNumber)}
        aria-label="{definition.name} {axis.label}"
        class="w-full accent-violet-500 disabled:opacity-40"
      />
      <input
        type="number"
        min="0"
        max={positionMax}
        value={isCentered ? "" : axisValue}
        placeholder="auto"
        disabled={isCentered}
        onchange={(event) =>
          setAxis(axis.index, event.currentTarget.valueAsNumber)}
        aria-label="{definition.name} {axis.label} value"
        class="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-2 py-1 text-right font-mono text-sm text-zinc-200 placeholder:text-zinc-500 focus:border-violet-400 focus:outline-none disabled:opacity-60"
      />
      <label
        class="col-start-2 col-end-4 -mt-1 flex items-center gap-2 text-xs text-zinc-400"
      >
        <input
          type="checkbox"
          checked={isCentered}
          onchange={(event) =>
            setCentered(axis.index, event.currentTarget.checked, axis.fallback)}
          class="size-3.5 accent-violet-500"
        />
        {axis.centerLabel}
      </label>
    </div>
  {/each}
</div>
