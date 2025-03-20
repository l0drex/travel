<script setup lang="ts">
import type { GeoJSON } from "geojson";
import ElevationGraph from "@components/track/ElevationGraph.vue";
import MapView from "@components/track/MapView.vue";
import { computed } from "vue";
import { getFeatureByName } from "@utils/geoJson.ts";
import { useUrlTitle } from "@utils/title.ts";
import { type JourneyType, journeyTypes } from "@utils/types.ts";

const { geoJson, journeyType } = defineProps<{
  geoJson: GeoJSON;
  journeyType: JourneyType;
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
  if (journeyType.id === "roadtrip") {
    return false;
  }

  if (currentFeature.value.type == "Feature") {
    if (currentFeature.value.geometry.type == "Point") {
      return false;
    }
  }

  return true;
});
</script>

<template>
  <MapView :geoJson="currentFeature" />
  <ElevationGraph :geo-json="currentFeature" v-if="showGraph" />
</template>
