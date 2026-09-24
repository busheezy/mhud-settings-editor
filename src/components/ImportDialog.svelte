<script lang="ts">
  import { decodeInput } from "../lib/code";
  import { applyPreferences } from "../lib/settings.svelte";

  type Props = {
    onimported: (count: number) => void;
  };

  const { onimported }: Props = $props();

  let dialog = $state<HTMLDialogElement>();
  let input = $state("");
  let error = $state("");

  export function open() {
    input = "";
    error = "";
    dialog?.showModal();
  }

  function close() {
    dialog?.close();
  }

  function readInput() {
    try {
      return decodeInput(input);
    } catch (caught) {
      error =
        caught instanceof Error ? caught.message : "Could not read that input.";

      return null;
    }
  }

  function submit(event: SubmitEvent) {
    event.preventDefault();

    const values = readInput();

    if (!values) {
      return;
    }

    const count = Object.keys(values).length;

    applyPreferences(values);
    close();
    onimported(count);
  }

  function onBackdropClick(event: MouseEvent) {
    if (event.target === dialog) {
      close();
    }
  }
</script>

<dialog
  bind:this={dialog}
  onclick={onBackdropClick}
  aria-labelledby="import-title"
  class="m-auto w-[min(36rem,calc(100vw-2rem))] rounded-2xl border border-zinc-800 bg-zinc-900 p-0 text-zinc-200 shadow-2xl shadow-black/60 backdrop:bg-black/70 backdrop:backdrop-blur-sm"
>
  <form class="flex flex-col gap-4 p-5" onsubmit={submit}>
    <div>
      <h2 id="import-title" class="text-base font-semibold text-zinc-100">
        Import settings
      </h2>
      <p class="mt-1 text-sm text-zinc-400">
        Paste the output of <code
          class="rounded bg-zinc-800 px-1 py-0.5 font-mono text-xs"
          >sm_mhud_export</code
        >, an import line, or a config file. Codes from older MovementHUD
        versions work too.
      </p>
    </div>

    <textarea
      bind:value={input}
      oninput={() => (error = "")}
      rows="6"
      spellcheck="false"
      placeholder="sm_mhud_import eyJyZXYiOjMsImRhdGEiOlsi..."
      aria-label="Settings to import"
      aria-invalid={error !== ""}
      aria-describedby="import-error"
      class="w-full resize-y rounded-xl border border-zinc-800 bg-zinc-950 p-3 font-mono text-xs text-zinc-200 placeholder:text-zinc-600 focus:border-violet-400 focus:outline-none aria-invalid:border-red-500/70"
    ></textarea>

    <p
      id="import-error"
      class="-mt-2 min-h-4 text-xs text-red-400"
      aria-live="polite"
    >
      {error}
    </p>

    <div class="flex justify-end gap-2">
      <button
        type="button"
        onclick={close}
        class="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
      >
        Cancel
      </button>
      <button
        type="submit"
        class="rounded-lg bg-violet-500 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-violet-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
      >
        Import
      </button>
    </div>
  </form>
</dialog>
