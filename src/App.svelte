<script lang="ts">
  import CopyButton from "./components/CopyButton.svelte";
  import ExportPanel from "./components/ExportPanel.svelte";
  import ImportDialog from "./components/ImportDialog.svelte";
  import PresetPicker from "./components/PresetPicker.svelte";
  import PreferenceField from "./components/PreferenceField.svelte";
  import Preview from "./components/Preview.svelte";
  import {
    definitions,
    getDefinitionsByGroup,
    isDefault,
    type PreferenceGroup,
  } from "./lib/preferences";
  import type { Preset } from "./lib/presets";
  import {
    loadFromHash,
    preferences,
    resetPreferences,
    serializeHash,
  } from "./lib/settings.svelte";

  type Section = {
    group: PreferenceGroup;
    title: string;
    description: string;
  };

  const sections: Section[] = [
    {
      group: "speed",
      title: "Speed",
      description: "Your current and takeoff speed.",
    },
    {
      group: "keys",
      title: "Keys",
      description: "The movement keys you are holding.",
    },
    {
      group: "indicators",
      title: "Indicators",
      description: "Callouts for jump bugs, crouch jumps, perfs, and gains.",
    },
    {
      group: "general",
      title: "General",
      description: "Settings that apply to the whole HUD.",
    },
  ];

  const upstreamUrl = "https://github.com/zer0k-z/movementhud";
  const repositoryUrl = "https://github.com/busheezy/mhud-settings-editor";

  let importDialog = $state<ImportDialog>();
  let notice = $state("");
  let noticeTimer: ReturnType<typeof setTimeout> | undefined;

  const hash = $derived(serializeHash(preferences));
  const basePath = `${window.location.pathname}${window.location.search}`;
  const pageUrl = $derived(hash === "" ? basePath : `${basePath}#${hash}`);
  const shareUrl = $derived(`${window.location.origin}${pageUrl}`);
  const changedCount = $derived(
    definitions.filter((definition) => !isDefault(preferences, definition.id))
      .length,
  );

  loadFromHash(window.location.hash);

  $effect(() => {
    history.replaceState(null, "", pageUrl);
  });

  function onHashChange() {
    loadFromHash(window.location.hash);
  }

  function showNotice(message: string) {
    clearTimeout(noticeTimer);
    notice = message;
    noticeTimer = setTimeout(() => {
      notice = "";
    }, 2500);
  }

  function onImported(count: number) {
    const noun = count === 1 ? "setting" : "settings";

    showNotice(`Imported ${count} ${noun}.`);
  }

  function onPresetApplied(preset: Preset) {
    showNotice(`Applied the ${preset.name} preset.`);
  }

  function reset() {
    resetPreferences();
    showNotice("All settings reset to defaults.");
  }
</script>

<svelte:window onhashchange={onHashChange} />

<div
  class="pointer-events-none fixed inset-x-0 top-0 -z-10 h-96 bg-[radial-gradient(ellipse_at_top,rgb(139_92_246/0.18),transparent_70%)]"
  aria-hidden="true"
></div>

<div class="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:py-12">
  <header
    class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
  >
    <div>
      <p
        class="text-xs font-semibold tracking-widest text-violet-300 uppercase"
      >
        MovementHUD
      </p>
      <h1
        class="mt-1 text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl"
      >
        Settings Editor
      </h1>
      <p class="mt-2 max-w-xl text-sm text-zinc-400">
        Build your MovementHUD layout, preview it live, and export it as an
        import code or config file. Works with the GOKZ-integrated
        <a
          href={upstreamUrl}
          class="text-violet-300 underline-offset-2 hover:underline"
          target="_blank"
          rel="noreferrer">MovementHUD</a
        >.
      </p>
    </div>
    <div class="flex flex-wrap items-center gap-2">
      <span class="mr-1 text-xs text-zinc-500">{changedCount} changed</span>
      <button
        type="button"
        onclick={() => importDialog?.open()}
        class="rounded-lg bg-violet-500 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-violet-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
      >
        Import
      </button>
      <CopyButton text={shareUrl} label="Copy share link" />
      <button
        type="button"
        onclick={reset}
        class="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm font-medium text-zinc-200 transition-colors hover:border-red-500/50 hover:text-red-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
      >
        Reset
      </button>
    </div>
  </header>

  <main
    class="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]"
  >
    <div class="order-2 flex flex-col gap-6 lg:order-1">
      <PresetPicker onapplied={onPresetApplied} />
      {#each sections as section (section.group)}
        <section class="rounded-2xl border border-zinc-800 bg-zinc-900/60">
          <div class="border-b border-zinc-800 px-5 py-4">
            <h2 class="text-base font-semibold text-zinc-100">
              {section.title}
            </h2>
            <p class="text-xs text-zinc-500">{section.description}</p>
          </div>
          <div class="divide-y divide-zinc-800/70 px-5 py-4">
            {#each getDefinitionsByGroup(section.group) as definition (definition.id)}
              <PreferenceField {definition} />
            {/each}
          </div>
        </section>
      {/each}
    </div>

    <div
      class="order-1 flex flex-col gap-6 lg:sticky lg:top-6 lg:order-2 lg:max-h-[calc(100dvh-3rem)]"
    >
      <div class="shrink-0">
        <Preview />
      </div>
      <ExportPanel />
    </div>
  </main>

  <footer
    class="flex flex-wrap items-center justify-between gap-2 border-t border-zinc-800 pt-6 text-xs text-zinc-500"
  >
    <span>Not affiliated with the MovementHUD authors.</span>
    <a
      href={repositoryUrl}
      class="hover:text-zinc-300"
      target="_blank"
      rel="noreferrer">Source on GitHub</a
    >
  </footer>
</div>

<ImportDialog bind:this={importDialog} onimported={onImported} />

<div
  class={[
    "fixed bottom-6 left-1/2 -translate-x-1/2 rounded-xl border border-zinc-700 bg-zinc-900/95 px-4 py-2 text-sm text-zinc-100 shadow-xl transition-all",
    notice === ""
      ? "pointer-events-none translate-y-4 opacity-0"
      : "translate-y-0 opacity-100",
  ]}
  role="status"
  aria-live="polite"
>
  {notice}
</div>
