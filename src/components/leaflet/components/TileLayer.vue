<script setup lang="ts">
import L from "leaflet";
import { useLeaflet } from "../composables/leaflet.ts";

const { urlTemplate, options } = defineProps<{
  urlTemplate: string;
  options?: L.TileLayerOptions;
}>();

const { map, onMapReady } = useLeaflet();

const tileLayer = L.tileLayer(urlTemplate, options);

onMapReady(() => {
  tileLayer.addTo(map.value!);
});
</script>

<template></template>
