<script setup lang="ts">
import WebGL from "three/examples/jsm/capabilities/WebGL";
import { TresCanvas } from '@tresjs/core';
import { type Journey } from "@utils/travel.ts";
import EarthContent from "./EarthContent.vue";
import {usePreferredReducedMotion} from "@vueuse/core";

const reducedMotion = usePreferredReducedMotion();
const enableAnimatedEarth: boolean = WebGL.isWebGL2Available() 
    && reducedMotion.value != "reduce";

const {journeys} = defineProps<{
  journeys: Journey[]
}>();
</script>

<template>
  <div id="container">
    <TresCanvas v-if="enableAnimatedEarth" id="canvas" window-size>
      <EarthContent :journeys="journeys"/>
    </TresCanvas>

    <slot v-else/>
  </div>
</template>
