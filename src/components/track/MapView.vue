<script setup lang="ts">
import 'leaflet/dist/leaflet.css';
import {LGeoJson, LMap, LTileLayer} from "@vue-leaflet/vue-leaflet";
import type {GeoJSON} from "geojson";
import L, {type StyleFunction} from "leaflet";
import {Chart, registerables} from "chart.js";
import {getColorPropertyString} from "@utils/general.ts";

globalThis.L = L;
Chart.register(...registerables);

const {geoJson} = defineProps<{
  geoJson: GeoJSON
}>();

let index = -1;
const trackColors = [getColorPropertyString("primary"), getColorPropertyString("secondary")];
const geoStyler: StyleFunction = (feature) => {
  index++;
  let color = trackColors[index % 2];
  return {
    color: color,
    weight: 5
  };
};

const zoom = 4;

const styles = {
  default: "https://tile.openstreetmap.de/{z}/{x}/{y}.png",
  toner: "https://tiles.stadiamaps.com/tiles/stamen_toner/{z}/{x}/{y}.png",
  watercolor: "https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg"
}

</script>

<template>
  <div id="map-container" class="h-96 relative">
    <l-map v-model:zoom="zoom" :center="[49.000, 13.000]" class="rounded-lg border-2 border-fg dark:border-fg-dark">
      <l-tile-layer
          :url="styles.toner"
          layer-type="base"
          name="OpenStreetMap"
          attribution="<a href='https://www.openstreetmap.de'>OpenStreetMap</a>"
      ></l-tile-layer>
      <l-geo-json :geojson="geoJson" :options-style="geoStyler"></l-geo-json>
    </l-map>
  </div>
</template>

<style scoped>
#map-container {
  /* h-96 seems to not work here */
  height: calc(var(--spacing) * 96);
}
</style>