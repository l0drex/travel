<script setup lang="ts">
import { ref } from "vue";
import WebGL from "three/examples/jsm/capabilities/WebGL";
import { TresCanvas } from '@tresjs/core';
import { type Journey, type JourneyScreen } from "@utils/travel.ts";
import EarthContent from "./EarthContent.vue";
import { dateFormatter } from "@utils/general.ts";

const webglSupported: boolean = WebGL.isWebGL2Available();

const {journeys} = defineProps<{
  journeys: Journey[]
}>();

const selectedJourney = ref<JourneyScreen | null>(null);

function onJourneySelected(journey: JourneyScreen) {
  selectedJourney.value = journey;
  const journeyPos = journey;
}

</script>

<template>
  <div id="container">
    <TresCanvas v-if="webglSupported" id="canvas">
      <EarthContent :journeys="journeys" @journeySelected="onJourneySelected"/>
    </TresCanvas>

    <slot v-else/>

    <div v-if="selectedJourney != null" id="footer">
      <div id="footer-content">
        <div id="annotation">
          <a :href="selectedJourney.url" class="">
            <h2>{{ selectedJourney.title }} ></h2>
            <p>
              {{ selectedJourney.type }} · {{ dateFormatter(selectedJourney.date) }}
            </p>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#container {
  position: relative;
  width: 100%;
  height: 450px;
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

#footer {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 100%;
}

#footer-content {
  max-width: 800px;
  margin: 0 auto;
}

#annotation {
  background: var(--background);
  padding: .5rem 1rem;
  margin-left: auto;
  text-align: right;
  width: max-content;
}

a:not(:hover) {
  text-decoration: none;
}

a h2, a p {
  margin: 0;
}
</style>