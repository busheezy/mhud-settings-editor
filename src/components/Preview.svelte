<script lang="ts">
  import { buildHud, type HudElement, type HudElementId } from "../lib/hud";
  import { getInt } from "../lib/preferences";
  import { preferences } from "../lib/settings.svelte";
  import { cycleDuration, getFrame, quantizeTime } from "../lib/simulation";
  import { formatXy, parseXy, positionMax, rgbToCss } from "../lib/values";
  import PreviewScene from "./PreviewScene.svelte";

  type DragState = {
    id: HudElementId;
    pointerId: number;
    startX: number;
    startY: number;
    startLeft: number;
    startTop: number;
    width: number;
    height: number;
    elementWidth: number;
  };

  const aspectRatios = [
    { label: "16:9", value: "16 / 9" },
    { label: "16:10", value: "16 / 10" },
    { label: "4:3", value: "4 / 3" },
  ];

  const positionIds: Record<HudElementId, string> = {
    speed: "speed_position",
    keys: "keys_position",
    indicators: "indicators_position",
  };

  const elementLabels: Record<HudElementId, string> = {
    speed: "Speed",
    keys: "Keys",
    indicators: "Indicators",
  };

  const snapThreshold = 0.015;

  let time = $state(0);
  let isPlaying = $state(true);
  let aspectRatio = $state("16 / 9");
  let drag = $state<DragState | null>(null);
  let isSnapped = $state(false);
  let screen = $state<HTMLDivElement>();

  const updateSpeed = $derived(getInt(preferences, "update_speed"));
  const displayTime = $derived(quantizeTime(time, updateSpeed));
  const frame = $derived(getFrame(displayTime));
  const elements = $derived(buildHud(preferences, frame));
  const progress = $derived((time % cycleDuration) / cycleDuration);
  const isAnimating = $derived(isPlaying && drag === null);
  const hasElements = $derived(elements.length > 0);

  $effect(() => {
    if (!isAnimating) {
      return;
    }

    let frameRequest = 0;
    let previous = performance.now();

    const step = (now: number) => {
      const delta = (now - previous) / 1000;

      previous = now;
      time += delta;
      frameRequest = requestAnimationFrame(step);
    };

    frameRequest = requestAnimationFrame(step);

    return () => cancelAnimationFrame(frameRequest);
  });

  function getHorizontalStyle(element: HudElement) {
    const [x] = element.xy;

    if (x === -1) {
      return "left: 0; right: 0; text-align: center;";
    }

    const left = (x / 1000) * 100;

    return `left: ${left}%; text-align: left;`;
  }

  function getVerticalStyle(element: HudElement) {
    const [, y] = element.xy;

    if (y === -1) {
      return "top: 50%; transform: translateY(-50%);";
    }

    const top = (y / 1000) * 100;

    return `top: ${top}%;`;
  }

  function getElementStyle(element: HudElement) {
    const horizontal = getHorizontalStyle(element);
    const vertical = getVerticalStyle(element);
    const color = rgbToCss(element.rgb);

    return `${horizontal} ${vertical} color: ${color};`;
  }

  function toThousandths(offset: number, size: number) {
    const ratio = offset / size;
    const value = Math.round(ratio * 1000);
    const clamped = Math.min(Math.max(value, 0), positionMax);

    return clamped;
  }

  function startDrag(event: PointerEvent, id: HudElementId) {
    const target = event.currentTarget;

    if (!screen || !(target instanceof HTMLElement)) {
      return;
    }

    const text = target.querySelector("[data-hud-text]");

    if (!(text instanceof HTMLElement)) {
      return;
    }

    event.preventDefault();
    target.setPointerCapture(event.pointerId);

    const screenRect = screen.getBoundingClientRect();
    const textRect = text.getBoundingClientRect();

    drag = {
      id,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startLeft: textRect.left - screenRect.left,
      startTop: textRect.top - screenRect.top,
      width: screenRect.width,
      height: screenRect.height,
      elementWidth: textRect.width,
    };
  }

  function getDraggedX(current: DragState, left: number) {
    const center = (left + current.elementWidth / 2) / current.width;
    const isNearCenter = Math.abs(center - 0.5) < snapThreshold;

    isSnapped = isNearCenter;

    if (isNearCenter) {
      return -1;
    }

    return toThousandths(left, current.width);
  }

  function moveDrag(event: PointerEvent) {
    const current = drag;

    if (!current || current.pointerId !== event.pointerId) {
      return;
    }

    const left = current.startLeft + event.clientX - current.startX;
    const top = current.startTop + event.clientY - current.startY;
    const x = getDraggedX(current, left);
    const y = toThousandths(top, current.height);
    const positionId = positionIds[current.id];

    preferences[positionId] = formatXy([x, y]);
  }

  function endDrag(event: PointerEvent) {
    if (drag?.pointerId !== event.pointerId) {
      return;
    }

    drag = null;
    isSnapped = false;
  }

  function nudge(event: KeyboardEvent, id: HudElementId) {
    const steps: Record<string, [number, number]> = {
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
    };

    const direction = steps[event.key];

    if (!direction) {
      return;
    }

    event.preventDefault();

    const positionId = positionIds[id];
    const [x, y] = parseXy(preferences[positionId] ?? "");
    const amount = event.shiftKey ? 25 : 5;
    const [dx, dy] = direction;
    const baseX = x === -1 ? 500 : x;
    const nextX =
      dx === 0 ? x : Math.min(Math.max(baseX + dx * amount, 0), positionMax);
    const nextY = Math.min(Math.max(y + dy * amount, 0), positionMax);

    preferences[positionId] = formatXy([nextX, nextY]);
  }

  function togglePlaying() {
    isPlaying = !isPlaying;
  }
</script>

<section
  class="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60 shadow-2xl shadow-black/40"
>
  <div
    class="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 px-4 py-3"
  >
    <div>
      <h2 class="text-sm font-semibold text-zinc-100">Live preview</h2>
      <p class="text-xs text-zinc-500">
        Drag elements to move them. Arrow keys nudge the focused element.
      </p>
    </div>
    <div class="flex items-center gap-2">
      <div
        class="flex rounded-lg border border-zinc-800 bg-zinc-950 p-0.5"
        role="radiogroup"
        aria-label="Aspect ratio"
      >
        {#each aspectRatios as ratio (ratio.value)}
          <button
            type="button"
            role="radio"
            aria-checked={aspectRatio === ratio.value}
            onclick={() => (aspectRatio = ratio.value)}
            class={[
              "rounded-md px-2 py-1 font-mono text-xs transition-colors focus-visible:outline-2 focus-visible:outline-violet-400",
              aspectRatio === ratio.value
                ? "bg-zinc-800 text-zinc-100"
                : "text-zinc-500 hover:text-zinc-300",
            ]}
          >
            {ratio.label}
          </button>
        {/each}
      </div>
      <button
        type="button"
        onclick={togglePlaying}
        class="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-700 hover:text-zinc-100 focus-visible:outline-2 focus-visible:outline-violet-400"
      >
        {isPlaying ? "Pause" : "Play"}
      </button>
    </div>
  </div>

  <div
    bind:this={screen}
    class="[container-type:size] relative w-full touch-none overflow-hidden bg-zinc-950 select-none"
    style:aspect-ratio={aspectRatio}
  >
    <PreviewScene />

    <div
      class="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      aria-hidden="true"
    >
      <div
        class="absolute top-1/2 left-1/2 h-[0.3cqh] w-[2.2cqh] -translate-x-1/2 -translate-y-1/2 bg-lime-300/90"
      ></div>
      <div
        class="absolute top-1/2 left-1/2 h-[2.2cqh] w-[0.3cqh] -translate-x-1/2 -translate-y-1/2 bg-lime-300/90"
      ></div>
    </div>

    {#if isSnapped}
      <div
        class="pointer-events-none absolute inset-y-0 left-1/2 w-px bg-violet-400/70"
        aria-hidden="true"
      ></div>
    {/if}

    {#each elements as element (element.id)}
      <div
        role="button"
        tabindex="0"
        aria-label="{elementLabels[
          element.id
        ]} position. Use arrow keys to move."
        class="group absolute cursor-move font-hud text-[3.2cqh] leading-[1.15] font-semibold whitespace-pre outline-none [text-shadow:0.12cqh_0.12cqh_0_rgb(0_0_0/0.9)]"
        style={getElementStyle(element)}
        onpointerdown={(event) => startDrag(event, element.id)}
        onpointermove={moveDrag}
        onpointerup={endDrag}
        onpointercancel={endDrag}
        onkeydown={(event) => nudge(event, element.id)}
      >
        <span
          data-hud-text
          class={[
            "relative inline-block rounded-sm outline-1 outline-offset-4 outline-transparent transition-[outline-color] group-hover:outline-violet-400/70 group-hover:outline-dashed group-focus-visible:outline-violet-400 group-focus-visible:outline-dashed",
            drag?.id === element.id && "outline-violet-300 outline-dashed",
          ]}
        >
          {element.text}
          <span
            class="pointer-events-none absolute -top-5 left-0 rounded bg-violet-500 px-1.5 py-0.5 font-sans text-[10px] leading-none font-semibold text-white opacity-0 transition-opacity [text-shadow:none] group-hover:opacity-100 group-focus-visible:opacity-100"
          >
            {elementLabels[element.id]}
          </span>
        </span>
      </div>
    {/each}

    {#if !hasElements}
      <div class="absolute inset-0 grid place-items-center p-6 text-center">
        <p
          class="rounded-xl bg-zinc-950/70 px-4 py-3 text-sm text-zinc-300 backdrop-blur"
        >
          Every HUD element is off. Turn on speed, keys, or indicators to see
          them here.
        </p>
      </div>
    {/if}
  </div>

  <div class="h-0.5 bg-zinc-800" aria-hidden="true">
    <div class="h-full bg-violet-500/70" style:width="{progress * 100}%"></div>
  </div>
</section>
