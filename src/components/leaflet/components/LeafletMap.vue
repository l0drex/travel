<script lang="ts" setup>
import L from "leaflet";
import "leaflet.fullscreen";
import { type InjectionKey, onMounted, ref } from "vue";
import { type LeafletContext, provideLeaflet } from "../composables/leaflet.ts";

const { height, options, mapKey } = defineProps<{
  height: string;
  options?: L.MapOptions;
  mapKey: InjectionKey<LeafletContext>;
}>();

const { map } = provideLeaflet(mapKey);

const mapEl = ref<HTMLDivElement | null>(null);

onMounted(() => {
  if (!mapEl.value) return;
  map.value = L.map(mapEl.value, options);
});
</script>

<template>
  <div ref="mapEl" class="leaflet-map">
    <slot />
  </div>
</template>

<style>
@import "leaflet/dist/leaflet.css";
@import "leaflet.fullscreen/dist/Control.FullScreen.css";

.leaflet-map {
  height: v-bind("height");
}
</style>
