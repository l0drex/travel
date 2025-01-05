<script setup lang="ts">
import type { GeoJSON } from "geojson";
import ElevationGraph from "@components/track/ElevationGraph.vue";
import MapView from "@components/track/MapView.vue";
import conf from "tailwind.config.mjs";

const {geoJson} = defineProps<{
  geoJson: GeoJSON
}>();

const accentColor = conf.theme.extend.colors.primary;

</script>

<template>
  <MapView :geoJson="geoJson" />
  <ElevationGraph :geo-json="geoJson" :track-color="accentColor" />
</template>
