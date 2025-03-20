<script setup lang="ts">
import WebGL from "three/examples/jsm/capabilities/WebGL";
import { TresCanvas } from "@tresjs/core";
import type { Journey } from "@utils/types.ts";
import EarthContent from "./EarthContent.vue";
import { usePreferredReducedMotion } from "@vueuse/core";
import { getColorPropertyString } from "@utils/color.ts";

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
  <TresCanvas v-if="enableAnimatedEarth" id="canvas" window-size>
    <EarthContent :journeys="journeys" />
  </TresCanvas>

  <svg
    v-else
    viewBox="0 5 100 90"
    xmlns="http://www.w3.org/2000/svg"
    class="h-screen w-screen"
  >
    <defs>
      <linearGradient id="earthGradient">
        <stop offset="0%" :stop-color="bg2"></stop>
        <stop offset="100%" :stop-color="bg"></stop>
      </linearGradient>

      <linearGradient id="earthGradientDark">
        <stop offset="0%" :stop-color="bg2Dark"></stop>
        <stop offset="100%" :stop-color="bgDark"></stop>
      </linearGradient>
    </defs>

    <circle
      cx="50"
      cy="50"
      r="50"
      class="fill-[url(#earthGradient)] dark:fill-[url(#earthGradientDark)]"
    ></circle>
  </svg>
</template>
