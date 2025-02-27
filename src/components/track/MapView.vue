<script setup lang="ts">
import type {GeoJSON} from "geojson";
import L, {type StyleFunction} from "leaflet";
import {getColorPropertyString, useUrlTitle} from "@utils/general.ts";
import {computed} from "vue";
import LeafletMap from "src/leaflet/components/LeafletMap.vue";
import TileLayer from "src/leaflet/components/TileLayer.vue";
import GeoJsonLayer from "src/leaflet/components/GeoJsonLayer.vue";

const {geoJson} = defineProps<{
  geoJson: GeoJSON
}>();

// style tracks

// TODO this is not responsive, a page reload is required
const currentUrlTitle = useUrlTitle();
const trackColors = [getColorPropertyString("primary"), getColorPropertyString("secondary")];
let index = 0;

const geoJsonOptions: L.GeoJSONOptions = {
  style: (feature) => {    
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
    }
}

const styles = {
  default: "https://tile.openstreetmap.de/{z}/{x}/{y}.png",
  toner: "https://tiles.stadiamaps.com/tiles/stamen_toner/{z}/{x}/{y}.png",
  watercolor: "https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg"
}

</script>

<template>
  <div class="rounded-lg border-2 border-fg dark:border-fg-dark">
    <leaflet-map height="400px">
      <tile-layer :url-template="styles.default"/>
      <geo-json-layer :geo-json="geoJson" :options="geoJsonOptions"/>
    </leaflet-map>
  </div>
</template>
