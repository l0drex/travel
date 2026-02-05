<script lang="ts" setup>
import L from "leaflet";
import { type LeafletContext, useLeaflet } from "../composables/leaflet.ts";
import type { InjectionKey } from "vue";

const { urlTemplate, options, mapKey } = defineProps<{
  urlTemplate: string;
  options?: L.TileLayerOptions;
  mapKey: InjectionKey<LeafletContext>;
}>();

const { map, onMapReady } = useLeaflet(mapKey);

const tileLayer = L.tileLayer(urlTemplate, options);

onMapReady(() => {
  tileLayer.addTo(map.value!);
});
</script>

<template></template>
