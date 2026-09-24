<script lang="ts">
  import {
    buildConfig,
    importCommand,
    maxCodeLength,
    maxLineLength,
    planExport,
  } from "../lib/code";
  import { codeOrder, definitions, isDefault } from "../lib/preferences";
  import { preferences } from "../lib/settings.svelte";
  import CopyButton from "./CopyButton.svelte";

  type Tab = "code" | "config";

  const configFileName = "mhud.cfg";

  let tab = $state<Tab>("code");

  const plan = $derived(planExport(preferences));
  const importLine = $derived(`${importCommand} ${plan.code}`);
  const codeLength = $derived(plan.code.length);
  const lengthPercent = $derived(
    Math.min((codeLength / maxCodeLength) * 100, 100),
  );
  const overflowIds = $derived(
    plan.commandIds.filter((id) => codeOrder.includes(id)),
  );
  const followUpIds = $derived(
    plan.commandIds.filter((id) => isFollowUp(id, overflowIds)),
  );
  const followUpConfig = $derived(buildConfig(preferences, followUpIds));
  const allIds = definitions.map((definition) => definition.id);
  const fullConfig = $derived(buildConfig(preferences, allIds));
  const hasFollowUp = $derived(followUpIds.length > 0);
  const hasOverflow = $derived(overflowIds.length > 0);
  const overflowText = $derived(describeOverflow(overflowIds.length));

  const tabs: { id: Tab; label: string }[] = [
    { id: "code", label: "Import code" },
    { id: "config", label: "Config file" },
  ];

  function isFollowUp(id: string, overflow: string[]) {
    const overflows = overflow.includes(id);
    const isChanged = !isDefault(preferences, id);

    return overflows || isChanged;
  }

  function describeOverflow(count: number) {
    if (count === 1) {
      return "the last setting is";
    }

    return `the last ${count} settings are`;
  }

  function downloadConfig() {
    const contents = `${fullConfig}\n`;
    const blob = new Blob([contents], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = configFileName;
    link.click();
    URL.revokeObjectURL(url);
  }
</script>

<section
  class="rounded-2xl border border-zinc-800 bg-zinc-900/60 lg:flex lg:min-h-0 lg:flex-col"
>
  <div
    class="flex items-center justify-between gap-3 border-b border-zinc-800 px-4 py-3"
  >
    <h2 class="text-sm font-semibold text-zinc-100">Export</h2>
    <div
      class="flex rounded-lg border border-zinc-800 bg-zinc-950 p-0.5"
      role="tablist"
      aria-label="Export format"
    >
      {#each tabs as item (item.id)}
        <button
          type="button"
          role="tab"
          aria-selected={tab === item.id}
          onclick={() => (tab = item.id)}
          class={[
            "rounded-md px-2.5 py-1 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-violet-400",
            tab === item.id
              ? "bg-zinc-800 text-zinc-100"
              : "text-zinc-500 hover:text-zinc-300",
          ]}
        >
          {item.label}
        </button>
      {/each}
    </div>
  </div>

  <div
    class="flex flex-col gap-4 p-4 lg:min-h-0 lg:overflow-y-auto"
    role="tabpanel"
  >
    {#if tab === "code"}
      <p class="text-sm text-zinc-400">
        Paste this into your in-game console and press enter.
      </p>

      <div class="flex items-center gap-3">
        <div class="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-800">
          <div
            class={[
              "h-full rounded-full transition-[width]",
              hasOverflow ? "bg-amber-400" : "bg-violet-500",
            ]}
            style:width="{lengthPercent}%"
          ></div>
        </div>
        <span class="font-mono text-xs text-zinc-500"
          >{codeLength} / {maxCodeLength}</span
        >
        <CopyButton text={importLine} primary />
      </div>

      <div class="rounded-xl border border-zinc-800 bg-zinc-950 p-3">
        <code
          class="block font-mono text-xs leading-relaxed break-all text-zinc-300"
          >{importLine}</code
        >
      </div>

      {#if hasOverflow}
        <p
          class="rounded-lg border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-xs text-amber-200"
        >
          The CS:GO console cuts lines off at {maxLineLength} characters, which leaves
          room for a {maxCodeLength} character code, so {overflowText} set with the
          commands below instead.
        </p>
      {/if}

      {#if hasFollowUp}
        <div class="flex flex-col gap-2">
          <div class="flex items-center justify-between gap-3">
            <p class="text-sm text-zinc-400">Then run these commands too:</p>
            <CopyButton text={followUpConfig} />
          </div>
          <pre
            class="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950 p-3 font-mono text-xs leading-relaxed text-zinc-300">{followUpConfig}</pre>
        </div>
      {/if}
    {:else}
      <p class="text-sm text-zinc-400">
        Sets every preference, including the ones codes cannot hold. Save it as
        <code
          class="rounded bg-zinc-800 px-1 py-0.5 font-mono text-xs text-zinc-200"
          >csgo/cfg/{configFileName}</code
        >
        and run
        <code
          class="rounded bg-zinc-800 px-1 py-0.5 font-mono text-xs text-zinc-200"
          >exec mhud</code
        >
        in your console, or paste the lines in directly.
      </p>
      <pre
        class="max-h-72 overflow-auto rounded-xl border border-zinc-800 bg-zinc-950 p-3 font-mono text-xs leading-relaxed text-zinc-300">{fullConfig}</pre>
      <div class="flex justify-end gap-2">
        <CopyButton text={fullConfig} />
        <button
          type="button"
          onclick={downloadConfig}
          class="rounded-lg bg-violet-500 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-violet-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
        >
          Download {configFileName}
        </button>
      </div>
    {/if}
  </div>
</section>
