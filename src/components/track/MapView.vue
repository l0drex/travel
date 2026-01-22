<script lang="ts" setup>
import type { GeoJSON } from "geojson";
import L from "leaflet";
import { getColorPropertyString } from "@utils/color.ts";
import { useUrlTitle } from "@utils/title.ts";
import { computed } from "vue";
import LeafletMap from "@components/leaflet/components/LeafletMap.vue";
import TileLayer from "@components/leaflet/components/TileLayer.vue";
import GeoJsonLayer from "@components/leaflet/components/GeoJsonLayer.vue";
import Slugger from "github-slugger";
import { useCurrentGeoFeature } from "@utils/currentGeoFeature.ts";

const { geoJson } = defineProps<{
  geoJson: GeoJSON;
}>();

const currentFeature = useCurrentGeoFeature(geoJson);

// style tracks

const trackColors = [
  getColorPropertyString("primary"),
  getColorPropertyString("secondary"),
];
const currentUrlTitle = useUrlTitle();

const styleFunction = computed<L.StyleFunction>(() => {
  let title = currentUrlTitle.value;
  let index = 0;

  return (feature) => {
    // apply differing styles by default
    let color = trackColors[index % 2];

    // if a title is selected, highlight current track instead
    // NOTE this will turn all tracks to the same color if no track has the corresponding title
    if (title != null) {
      const currentFeatureTitle = feature?.properties?.name;

      if (currentFeatureTitle == title) {
        color = trackColors[0];
      } else {
        color = trackColors[1];
      }
    }

    index++;
    return {
      color: color.value,
      weight: 5,
    };
  };
});

// astro uses rehype-slug, which uses github-slugger, so we use this here to convert the heading to the id
// this might break in the future, since we are using the implementation 2 dependencies down...
const slugger = new Slugger();

const geoJsonOptions: L.GeoJSONOptions = {
  style: styleFunction.value,
  onEachFeature: (feature, layer) => {
    layer.bindPopup(
      // link to heading in current markdown post with id of feature as name
      `<a href="#${slugger.slug(feature.properties["name"])}">${feature.properties["name"]}</a>`,
    );
  },
};

const tileOptions: L.TileLayerOptions = {
  attribution: "<a href='https://openstreetmap.de'>&copy; OpenStreetMap DE</a>",
};

const styles = {
  default: "https://tile.openstreetmap.de/{z}/{x}/{y}.png",
  toner: "https://tiles.stadiamaps.com/tiles/stamen_toner/{z}/{x}/{y}.png",
  watercolor:
    "https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg",
};

const mapOptions: L.MapOptions = {
  fullscreenControl: true,
};
</script>

<template>
  <div class="rounded-lg border-2 border-line dark:border-fg-dark">
    <leaflet-map :options="mapOptions" height="400px">
      <tile-layer :options="tileOptions" :url-template="styles.default" />
      <geo-json-layer :geo-json="currentFeature" :options="geoJsonOptions" />
    </leaflet-map>
  </div>
</template>
