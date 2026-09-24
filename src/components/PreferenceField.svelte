<script lang="ts">
  import {
    isPreferenceActive,
    type PreferenceDefinition,
  } from "../lib/preferences";
  import { preferences } from "../lib/settings.svelte";
  import BoolField from "./BoolField.svelte";
  import ColorField from "./ColorField.svelte";
  import EnumField from "./EnumField.svelte";
  import PositionField from "./PositionField.svelte";

  type Props = {
    definition: PreferenceDefinition;
  };

  const { definition }: Props = $props();

  const isActive = $derived(isPreferenceActive(preferences, definition.id));
  const isChanged = $derived(
    preferences[definition.id] !== definition.defaultValue,
  );
  const isInline = $derived(definition.kind === "bool");

  function resetToDefault() {
    preferences[definition.id] = definition.defaultValue;
  }
</script>

<div
  class={[
    "flex gap-3 py-4 transition-opacity first:pt-0 last:pb-0",
    isInline ? "flex-row items-center justify-between" : "flex-col",
    !isActive && "opacity-45 focus-within:opacity-100 hover:opacity-80",
  ]}
>
  <div class="min-w-0">
    <div class="flex items-center gap-2">
      <span class="text-sm font-medium text-zinc-100">{definition.name}</span>
      {#if isChanged}
        <button
          type="button"
          onclick={resetToDefault}
          class="rounded px-1.5 py-0.5 text-[11px] font-medium text-violet-300 hover:bg-violet-500/15 focus-visible:outline-2 focus-visible:outline-violet-400"
        >
          Reset
        </button>
      {/if}
    </div>
    <p class="mt-0.5 text-xs text-zinc-500">{definition.description}</p>
  </div>

  {#if definition.kind === "enum"}
    <EnumField {definition} />
  {:else if definition.kind === "bool"}
    <BoolField {definition} />
  {:else if definition.kind === "rgb"}
    <ColorField {definition} />
  {:else}
    <PositionField {definition} />
  {/if}
</div>
