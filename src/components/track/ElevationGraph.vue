<script setup lang="ts">
import {LineChart} from "vue-chart-3";
import {ref} from "vue";
import {getDistance, getElevation, getPoints, reduceSize} from "@utils/geoJson.ts";
import type {GeoJSON} from "geojson";

const {geoJson} = defineProps<{
  geoJson: GeoJSON,
  trackColor: string,
}>();

const points = getPoints(geoJson);
const elevation = getElevation(points);

function getLabels() {
  let distances = points.map((k, i) => getDistance(k, points[i - 1]));

  // accumulate distances
  let lastProgress = 0;
  return distances.map((d, i) => {
    let p = (i === 0) ? 0 : d + lastProgress;
    lastProgress = p;
    return `${Math.round(p)} km`;
  });
}

const data = ref({
  labels: reduceSize(getLabels(), 300),
  datasets: [{
    label: 'Elevation',
    data: reduceSize(elevation, 300)
  }]
});

</script>

<template>
  <LineChart :chart-data="data" :options="{ borderColor: trackColor, backgroundColor: trackColor, pointRadius: 0 }"
             :height="200"/>
</template>

<style scoped>

</style>