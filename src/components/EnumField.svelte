<script lang="ts">
  import type { EnumDefinition } from "../lib/preferences";
  import { preferences } from "../lib/settings.svelte";

  type Props = {
    definition: EnumDefinition;
  };

  const { definition }: Props = $props();

  const selected = $derived(preferences[definition.id]);

  function select(index: number) {
    preferences[definition.id] = String(index);
  }
</script>

<div
  role="radiogroup"
  aria-label={definition.name}
  class="flex flex-wrap gap-1.5"
>
  {#each definition.options as option, index (option)}
    {@const isSelected = selected === String(index)}
    <button
      type="button"
      role="radio"
      aria-checked={isSelected}
      onclick={() => select(index)}
      class={[
        "rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400",
        isSelected
          ? "border-violet-400/60 bg-violet-500/20 text-violet-100"
          : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200",
      ]}
    >
      {option}
    </button>
  {/each}
</div>
