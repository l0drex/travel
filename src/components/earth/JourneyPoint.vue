<script setup lang="ts">
import { positionAtCoordinate } from "@utils/geoJson.ts";
import { getColorProperty } from "@utils/color.ts";
import { computed } from "vue";
import { Color } from "three";
import type { Journey } from "@utils/types.ts";
import { Line2 } from "@tresjs/cientos";

const primary = getColorProperty("primary");
const primaryColor = computed(
  () => new Color(primary.value.toString({ format: "hex" })),
);

const { points } = defineProps<Journey>();
const start = points[0];
const end = points[points.length - 1];
</script>

<template>
  <Line2
    :points="points.map((p) => positionAtCoordinate(p[0], p[1]))"
    :color="primaryColor"
  />

  <TresMesh
    :position="positionAtCoordinate(start[0], start[1])"
    :look-at="positionAtCoordinate(start[0], start[1], 1)"
  >
    <TresRingGeometry :args="[0.003, 0.005, 16, 1]" />
    <TresMeshStandardMaterial :color="primaryColor" />
  </TresMesh>

  <TresMesh
    :position="positionAtCoordinate(end[0], end[1])"
    :look-at="positionAtCoordinate(end[0], end[1], 1)"
  >
    <TresCircleGeometry :args="[0.004, 16]" />
    <TresMeshStandardMaterial :color="primaryColor" />
  </TresMesh>
</template>
