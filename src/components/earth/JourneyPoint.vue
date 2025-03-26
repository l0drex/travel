<script setup lang="ts">
import { positionAtCoordinate } from "@utils/geoJson.ts";
import { getColorProperty } from "@utils/color.ts";
import { computed } from "vue";
import { Color } from "three";

const primary = getColorProperty("primary");
const primaryColor = computed(
  () => new Color(primary.value.toString({ format: "hex" })),
);

const { location } = defineProps<{
  location: [number, number];
}>();
const dotPos = positionAtCoordinate(location[0], location[1]);
const dotLook = positionAtCoordinate(location[0], location[1], 1);
</script>

<template>
  <TresMesh :position="dotPos" :look-at="dotLook">
    <TresCircleGeometry :args="[0.005, 32]" />
    <TresMeshStandardMaterial :color="primaryColor" />
  </TresMesh>
</template>
