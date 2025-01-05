<script setup lang="ts">
import { positionAtCoordinate } from "@utils/geoJson.ts";
import conf from "tailwind.config.mjs";

const { location } = defineProps<{
  location: [number, number];
}>();
const dotPos = positionAtCoordinate(location[0], location[1]);
const dotLook = positionAtCoordinate(location[0], location[1], 1);
const color = conf.theme.extend.colors.primary;
</script>

<template>
  <TresMesh :position="dotPos" :look-at="dotLook">
    <TresCircleGeometry :args="[.01, 32]" />
    <TresMeshStandardMaterial :color="color" />
  </TresMesh>
</template>
