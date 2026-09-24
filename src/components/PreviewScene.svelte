<script lang="ts">
  const viewBox = "0 0 1600 900";
</script>

<svg
  class="absolute inset-0 size-full"
  {viewBox}
  preserveAspectRatio="xMidYMid slice"
  aria-hidden="true"
>
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#1e293b" />
      <stop offset="0.55" stop-color="#475569" />
      <stop offset="1" stop-color="#94a3b8" />
    </linearGradient>
    <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#3f3f46" />
      <stop offset="1" stop-color="#18181b" />
    </linearGradient>
    <linearGradient id="block" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#52525b" />
      <stop offset="1" stop-color="#27272a" />
    </linearGradient>
    <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
      <path
        d="M80 0H0V80"
        fill="none"
        stroke="#71717a"
        stroke-opacity="0.25"
        stroke-width="2"
      />
    </pattern>
  </defs>
  <rect width="1600" height="520" fill="url(#sky)" />
  <path d="M0 520 L1600 520 L1600 900 L0 900 Z" fill="url(#floor)" />
  <path
    d="M0 520 L1600 520 L1600 900 L0 900 Z"
    fill="url(#grid)"
    opacity="0.5"
  />
  <g opacity="0.9">
    <path d="M170 520 L170 400 L360 380 L360 520 Z" fill="url(#block)" />
    <path d="M170 400 L360 380 L420 395 L230 415 Z" fill="#71717a" />
    <path d="M620 520 L620 440 L760 430 L760 520 Z" fill="url(#block)" />
    <path d="M620 440 L760 430 L800 440 L660 450 Z" fill="#71717a" />
    <path d="M980 520 L980 360 L1180 340 L1180 520 Z" fill="url(#block)" />
    <path d="M980 360 L1180 340 L1240 355 L1040 375 Z" fill="#71717a" />
    <path d="M1320 520 L1320 420 L1480 410 L1480 520 Z" fill="url(#block)" />
    <path d="M1320 420 L1480 410 L1520 420 L1360 430 Z" fill="#71717a" />
  </g>
  <path d="M0 640 L1600 610 L1600 900 L0 900 Z" fill="#09090b" opacity="0.35" />
</svg>
