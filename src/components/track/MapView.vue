<script setup lang="ts">
import 'leaflet/dist/leaflet.css';
import {LGeoJson, LMap, LTileLayer} from "@vue-leaflet/vue-leaflet";
import type {GeoJSON} from "geojson";
import L, {type StyleFunction} from "leaflet";
import {Chart, registerables} from "chart.js";
import {getColorPropertyString, useUrlTitle} from "@utils/general.ts";
import {computed, useTemplateRef, watch} from "vue";

globalThis.L = L;
Chart.register(...registerables);

const {geoJson} = defineProps<{
  geoJson: GeoJSON
}>();

// style tracks

// TODO this is not responsive, a page reload is required
const currentUrlTitle = useUrlTitle();
const geoStyler = computed<StyleFunction>(() => {
  const trackColors = [getColorPropertyString("primary"), getColorPropertyString("secondary")];
  let index = -1;
  
  return (feature) => {
    // apply differing styles by default
    let color = trackColors[index % 2];
  
    // if a title is selected, highlight current track instead
    // NOTE this will turn all tracks to the same color if no track has the corresponding title
    if (currentUrlTitle.value != null) {
      const currentFeatureTitle = feature?.properties?.name;
  
      if (currentFeatureTitle == currentUrlTitle.value) {
        color = trackColors[0];
      } else {
        color = trackColors[1];
      }
    }
  
    index++;
    return {
      color: color,
      weight: 5
  };
}});

// zoom to show the whole track

const map = useTemplateRef("map");
const geoLayer = useTemplateRef("geoLayer");

function updateZoom() {
  if (map.value == null || geoLayer.value == null) {
    return;
  }

  const bounds = geoLayer.value.leafletObject?.getBounds();
  if (bounds != null) {
    map.value.leafletObject?.fitBounds(bounds);
  }
}

watch(map, updateZoom);
watch(geoLayer, updateZoom);

const styles = {
  default: "https://tile.openstreetmap.de/{z}/{x}/{y}.png",
  toner: "https://tiles.stadiamaps.com/tiles/stamen_toner/{z}/{x}/{y}.png",
  watercolor: "https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg"
}

</script>

<template>
  <div id="map-container" class="h-96 relative">
    <l-map ref="map" class="rounded-lg border-2 border-fg dark:border-fg-dark">
      <l-tile-layer
          :url="styles.default"
          layer-type="base"
          name="OpenStreetMap"
          attribution="<a href='https://www.openstreetmap.de'>OpenStreetMap</a>"
      ></l-tile-layer>
      <l-geo-json ref="geoLayer" :geojson="geoJson" :options-style="geoStyler"></l-geo-json>
    </l-map>
  </div>
</template>

<style scoped>
#map-container {
  /* h-96 seems to not work here */
  height: calc(var(--spacing) * 96);
}
</style>