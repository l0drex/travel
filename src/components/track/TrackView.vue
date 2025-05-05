<script setup lang="ts">
import type { GeoJSON } from "geojson";
import ElevationGraph from "@components/track/ElevationGraph.vue";
import MapView from "@components/track/MapView.vue";
import { computed } from "vue";
import { getFeatureByName } from "@utils/geoJson.ts";
import { useUrlTitle } from "@utils/title.ts";

const { geoJson, isCollection } = defineProps<{
  geoJson: GeoJSON;
  isCollection: boolean;
}>();

// show feature currently selected

const currentUrlTitle = useUrlTitle();
const currentFeature = computed(() => {
  if (currentUrlTitle.value == null) {
    return geoJson;
  }

  const feature = getFeatureByName(currentUrlTitle.value, geoJson);
  if (feature == null) {
    return geoJson;
  }
  return feature;
});

const showGraph = computed(() => {
  /*
   * roadtrip is expected to be a collection of small unconnected hiking tracks and points,
   * therefore elevation data makes no sense here
   */
  if (isCollection && currentUrlTitle.value == null) {
    return false;
  }

  // Points have no elevation data either
  if (
    currentFeature.value.type == "Feature" &&
    currentFeature.value.geometry.type == "Point"
  ) {
    return false;
  }

  return true;
});
</script>

<template>
  <MapView :geoJson="currentFeature" />
  <ElevationGraph :geo-json="currentFeature" v-if="showGraph" />
</template>
