<script lang="ts">
  import type { BoolDefinition } from "../lib/preferences";
  import { preferences } from "../lib/settings.svelte";

  type Props = {
    definition: BoolDefinition;
  };

  const { definition }: Props = $props();

  const isOn = $derived(preferences[definition.id] === "1");

  function toggle() {
    preferences[definition.id] = isOn ? "0" : "1";
  }
</script>

<button
  type="button"
  role="switch"
  aria-checked={isOn}
  aria-label={definition.name}
  onclick={toggle}
  class={[
    "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400",
    isOn ? "border-violet-400/60 bg-violet-500" : "border-zinc-700 bg-zinc-800",
  ]}
>
  <span
    class={[
      "inline-block size-4 rounded-full bg-white shadow transition-transform",
      isOn ? "translate-x-6" : "translate-x-1",
    ]}
  ></span>
</button>
