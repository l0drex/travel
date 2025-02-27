<script setup lang="ts">
import L from "leaflet";
import {useLeaflet} from "../composables/leaflet.ts";
import type {GeoJsonObject} from "geojson";

const {geoJson, options} = defineProps<{
  geoJson: GeoJsonObject,
  options?: L.GeoJSONOptions
}>();

const {map, onMapReady} = useLeaflet();

const layer = L.geoJSON(geoJson, options);

onMapReady(() => {
  layer.addTo(map.value!);
  map.value?.fitBounds(layer.getBounds())
})

</script>

<template></template>
