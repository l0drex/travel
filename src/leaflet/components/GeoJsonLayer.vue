<script setup lang="ts">
import L from "leaflet";
import {useLeaflet} from "../composables/leaflet.ts";
import type {GeoJsonObject} from "geojson";
import {computed, watch} from "vue";

const {geoJson, options} = defineProps<{
  geoJson: GeoJsonObject,
  options?: L.GeoJSONOptions
}>();

const {map, onMapReady} = useLeaflet();

const layer = computed<L.GeoJSON>(() => L.geoJSON(geoJson, options));

const update = () => {
  layer.value.removeFrom(map.value!);
  
  layer.value.addTo(map.value!);
  map.value?.fitBounds(layer.value.getBounds())
};

onMapReady(update);
watch(layer, update);

</script>

<template></template>
