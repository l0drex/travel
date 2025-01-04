<script setup lang="ts">
import type { GeoJSON } from "geojson";
import ElevationGraph from "@components/track/ElevationGraph.vue";
import MapView from "@components/track/MapView.vue";
import {colors} from "@utils/theme.ts";

const {geoJson} = defineProps<{
  geoJson: GeoJSON
}>();

const accentColor = colors.accent;

</script>

<template>
  <MapView :geoJson="geoJson" />
  <ElevationGraph :geo-json="geoJson" :track-color="accentColor" />
</template>
