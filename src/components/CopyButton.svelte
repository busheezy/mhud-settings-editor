<script lang="ts">
  type Props = {
    text: string;
    label?: string;
    primary?: boolean;
  };

  const { text, label = "Copy", primary = false }: Props = $props();

  let status = $state<"idle" | "copied" | "failed">("idle");
  let resetTimer: ReturnType<typeof setTimeout> | undefined;

  const buttonLabel = $derived(getButtonLabel(status, label));

  function getButtonLabel(currentStatus: typeof status, idleLabel: string) {
    if (currentStatus === "copied") {
      return "Copied!";
    }

    if (currentStatus === "failed") {
      return "Copy failed";
    }

    return idleLabel;
  }

  async function copy() {
    clearTimeout(resetTimer);

    try {
      await navigator.clipboard.writeText(text);
      status = "copied";
    } catch {
      status = "failed";
    }

    resetTimer = setTimeout(() => {
      status = "idle";
    }, 1600);
  }
</script>

<button
  type="button"
  onclick={copy}
  aria-live="polite"
  class={[
    "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400",
    primary
      ? "bg-violet-500 text-white hover:bg-violet-400"
      : "border border-zinc-700 bg-zinc-800 text-zinc-200 hover:border-zinc-600 hover:bg-zinc-700",
    status === "copied" && "bg-emerald-600! text-white! hover:bg-emerald-600!",
  ]}
>
  {buttonLabel}
</button>
