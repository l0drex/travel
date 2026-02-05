<script lang="ts" setup>
import L from "leaflet";
import { type LeafletContext, useLeaflet } from "../composables/leaflet.ts";
import type { GeoJsonObject } from "geojson";
import { computed, type InjectionKey, watch } from "vue";

const { geoJson, options, mapKey } = defineProps<{
  geoJson: GeoJsonObject;
  options?: L.GeoJSONOptions;
  mapKey: InjectionKey<LeafletContext>;
}>();

const { map, onMapReady } = useLeaflet(mapKey);

const layer = computed<L.GeoJSON>(() => L.geoJSON(geoJson, options));

const update = () => {
  layer.value.removeFrom(map.value!);

  layer.value.addTo(map.value!);
  map.value?.fitBounds(layer.value.getBounds());
};

onMapReady(update);
watch(layer, update);
</script>

<template></template>
