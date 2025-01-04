<script setup lang="ts">

import { positionAtCoordinate } from "@utils/geoJson.ts";
import {usePreferredColorScheme} from "@vueuse/core";

const colorScheme = usePreferredColorScheme()

const { location } = defineProps<{
  location: [number, number];
}>();
const dotPos = positionAtCoordinate(location[0], location[1]);
const dotLook = positionAtCoordinate(location[0], location[1], 1);
const color = colorScheme.value === "dark" ? "#450a0a" : "#f87171";
</script>

<template>
  <TresMesh :position="dotPos" :look-at="dotLook">
    <TresCircleGeometry :args="[.01, 32]" />
    <TresMeshStandardMaterial :color="color" />
  </TresMesh>
</template>
