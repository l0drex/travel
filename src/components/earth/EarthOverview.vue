<script lang="ts" setup>
import WebGL from "three/examples/jsm/capabilities/WebGL";
import type { Journey } from "@utils/types.ts";
import { usePreferredReducedMotion } from "@vueuse/core";
import { getColorPropertyString } from "@utils/color.ts";
import { defineAsyncComponent } from "vue";

const TresCanvas = defineAsyncComponent(() =>
  import("@tresjs/core").then((t) => t.TresCanvas),
);
const EarthContent = defineAsyncComponent(() => import("./EarthContent.vue"));

const reducedMotion = usePreferredReducedMotion();
const enableAnimatedEarth: boolean =
  WebGL.isWebGL2Available() && reducedMotion.value != "reduce";

const { journeys } = defineProps<{
  journeys: Journey[];
}>();

// tailwind colors
const bg = getColorPropertyString("bg");
const bgDark = getColorPropertyString("bg-dark");
const bg2 = getColorPropertyString("bg-2");
const bg2Dark = getColorPropertyString("bg-2-dark");
</script>

<template>
  <TresCanvas
    v-if="enableAnimatedEarth"
    id="canvas"
    :alpha="true"
    :clearAlpha="0"
    window-size
  >
    <EarthContent :journeys="journeys" />
  </TresCanvas>

  <svg
    v-else
    class="h-screen w-screen"
    viewBox="0 5 100 90"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="earthGradient">
        <stop :stop-color="bg2" offset="0%"></stop>
        <stop :stop-color="bg" offset="100%"></stop>
      </linearGradient>

      <linearGradient id="earthGradientDark">
        <stop :stop-color="bg2Dark" offset="0%"></stop>
        <stop :stop-color="bgDark" offset="100%"></stop>
      </linearGradient>
    </defs>

    <circle
      class="fill-[url(#earthGradient)] dark:fill-[url(#earthGradientDark)]"
      cx="50"
      cy="50"
      r="50"
    ></circle>
  </svg>
</template>
