<script setup lang="ts">
import L from "leaflet";
import {useLeaflet} from "../composables/leaflet.ts";
import {onMounted} from "vue";

const { height, options } = defineProps<{
  height: string,
  options?: L.MapOptions
}>();

const {map} = useLeaflet();

onMounted(() => {
  map.value = L.map('map', options);
});
</script>

<template>
<div id="map">
  <slot/>
</div>
</template>

<style>
@import "leaflet/dist/leaflet.css";

#map {
  height: v-bind('height');
}
</style>
