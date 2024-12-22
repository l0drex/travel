<script setup lang="ts">
import WebGL from "three/examples/jsm/capabilities/WebGL";
import { TresCanvas } from '@tresjs/core';
import { type Journey } from "@utils/travel.ts";
import EarthContent from "./EarthContent.vue";

const webglSupported: boolean = WebGL.isWebGL2Available();

const {journeys} = defineProps<{
  journeys: Journey[]
}>();
</script>

<template>
  <div id="container">
    <TresCanvas v-if="webglSupported" id="canvas">
      <EarthContent :journeys="journeys"/>
    </TresCanvas>

    <slot v-else/>
  </div>
</template>

<style scoped>
#container {
  position: absolute;
  top: 0;
  left: 0;
  z-index: -100;
  
  width: 100%;
  height: 100%;
}

#canvas {
  height: 100%;
}

@media (min-height: 850px) {
  #container {
    height: 600px;
  }
}

@media (min-height: 1000px) {
  #container {
    height: 800px;
  }
}
</style>