<script lang="ts" setup>
import WebGL from "three/examples/jsm/capabilities/WebGL";
import type { Journey } from "@utils/types.ts";
import { usePreferredReducedMotion } from "@vueuse/core";
import { getColorPropertyString } from "@utils/color.ts";
import { defineAsyncComponent } from "vue";
import EarthFallback from "@components/earth/EarthFallback.vue";

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

  <EarthFallback v-else />
</template>
