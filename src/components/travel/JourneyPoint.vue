<script setup lang="ts">

import { positionAtCoordinate } from "@utils/travel.ts";

const { location } = defineProps<{
  location: [number, number];
}>();

const dotPos = positionAtCoordinate(location[0], location[1]);
const dotLook = positionAtCoordinate(location[0], location[1], 1);
</script>

<template>
  <TresMesh :position="dotPos" :look-at="dotLook">
    <TresCircleGeometry :args="[.01, 32]" />
    <TresMeshStandardMaterial color="#450a0a" />
  </TresMesh>
</template>
