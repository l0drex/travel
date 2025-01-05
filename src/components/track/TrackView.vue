<script setup lang="ts">
import type { GeoJSON } from "geojson";
import ElevationGraph from "@components/track/ElevationGraph.vue";
import MapView from "@components/track/MapView.vue";

const {geoJson} = defineProps<{
  geoJson: GeoJSON
}>();
</script>

<template>
  <MapView :geoJson="geoJson" />
  <ElevationGraph :geo-json="geoJson" />
</template>
