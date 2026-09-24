<script lang="ts">
  import backgroundImage from "../assets/preview-background.webp";

  type Props = {
    solidColor: string | null;
  };

  const { solidColor }: Props = $props();
</script>

{#if solidColor}
  <div
    class="absolute inset-0"
    style:background-color={solidColor}
    aria-hidden="true"
  ></div>
{:else}
  <img
    src={backgroundImage}
    alt=""
    class="absolute inset-0 size-full object-cover"
    draggable="false"
    aria-hidden="true"
  />
{/if}
