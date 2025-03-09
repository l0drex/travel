<script setup lang="ts">
import type { GeoJSON } from "geojson";
import ElevationGraph from "@components/track/ElevationGraph.vue";
import MapView from "@components/track/MapView.vue";
import {computed} from "vue";
import {getFeatureByName} from "@utils/geoJson.ts";
import {useUrlTitle} from "@utils/title.ts";

const {geoJson} = defineProps<{
  geoJson: GeoJSON
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

</script>

<template>
  <MapView :geoJson="currentFeature" />
  <ElevationGraph :geo-json="currentFeature" />
</template>
