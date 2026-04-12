<script lang="ts" setup>
import WebGL from "three/examples/jsm/capabilities/WebGL";
import type { Journey, VisitedCountry } from "@utils/types.ts";
import { usePreferredReducedMotion } from "@vueuse/core";
import { defineAsyncComponent } from "vue";
import EarthFallback from "@components/earth/EarthFallback.vue";
import { NoToneMapping } from "three";

const TresCanvas = defineAsyncComponent(() =>
  import("@tresjs/core").then((t) => t.TresCanvas),
);
const EarthContent = defineAsyncComponent(() => import("./EarthContent.vue"));

const reducedMotion = usePreferredReducedMotion();
const enableAnimatedEarth: boolean =
  WebGL.isWebGL2Available() && reducedMotion.value != "reduce";

const { journeys, countries } = defineProps<{
  journeys: Journey[];
  countries: VisitedCountry[];
}>();
</script>

<template>
  <TresCanvas
    v-if="enableAnimatedEarth"
    id="canvas"
    :clearAlpha="0"
    :toneMapping="NoToneMapping"
    window-size
  >
    <EarthContent :journeys="journeys" :countries="countries" />
  </TresCanvas>

  <EarthFallback v-else />
</template>
