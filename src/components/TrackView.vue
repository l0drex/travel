<script setup lang="ts">
import 'leaflet/dist/leaflet.css';
import type { StyleFunction } from "leaflet";
import L, { type CircleMarkerOptions, LatLng } from "leaflet";
import { LGeoJson, LMap, LTileLayer } from "@vue-leaflet/vue-leaflet";
import { ref } from "vue";
import { Chart, registerables } from "chart.js";
import { LineChart } from "vue-chart-3";
import { getDistance, getElevation, getPoints, reduceSize } from "@utils/travel.ts";
import type { Feature, GeoJSON } from "geojson";

globalThis.L = L;
Chart.register(...registerables);

const {geoJson, title} = defineProps<{
  geoJson: GeoJSON,
  title: string
}>();

const accentColor = "red";

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

let index = -1;
const colors = ["red", "blue"];
const geoStyler: StyleFunction = (feature) => {
  index++;
  let color = colors[index % 2];
  return {
    opacity: feature?.properties.code / 100000,
    color: color
  };
};

const markerOptions: CircleMarkerOptions = {
  radius: 8,
  attribution: 'test'
}
const pointToLayout = (feature: Feature, latlng: LatLng) => L.circleMarker(latlng, markerOptions)

const zoom = 4;

const styles = {
  default: "https://tile.openstreetmap.de/{z}/{x}/{y}.png",
  toner: "https://tiles.stadiamaps.com/tiles/stamen_toner/{z}/{x}/{y}.png",
  watercolor: "https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg"
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
  <div id="map-container">
    <l-map v-model:zoom="zoom" :center="[49.000, 13.000]">
      <l-tile-layer
          :url="styles.toner"
          layer-type="base"
          name="OpenStreetMap"
          attribution="<a href='https://www.openstreetmap.de'>OpenStreetMap</a>"
      ></l-tile-layer>
      <l-geo-json :geojson="geoJson" :options-style="geoStyler"
                  :options="{ pointToLayer: pointToLayout }"></l-geo-json>
    </l-map>
  </div>

  <LineChart :chart-data="data" :options="{ borderColor: accentColor, backgroundColor: accentColor, pointRadius: 0 }"
             :height="200"/>
</template>

<style scoped>
#map-container {
  width: 100%;
  height: 450px;
  position: relative;
}
</style>