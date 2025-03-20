<script setup lang="ts">
import { positionAtCoordinate } from "@utils/geoJson.ts";
import { getColorPropertyArray } from "@utils/color.ts";

const primary = getColorPropertyArray("primary");

const { location } = defineProps<{
  location: [number, number];
}>();
const dotPos = positionAtCoordinate(location[0], location[1]);
const dotLook = positionAtCoordinate(location[0], location[1], 1);
</script>

<template>
  <TresMesh :position="dotPos" :look-at="dotLook">
    <TresCircleGeometry :args="[0.005, 32]" />
    <TresMeshStandardMaterial :color="primary" />
  </TresMesh>
</template>
