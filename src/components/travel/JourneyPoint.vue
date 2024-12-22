<script setup lang="ts">

import { positionAtCoordinate, worldToScreen } from "@utils/travel.ts";
import { useTresContext } from "@tresjs/core";
import { Vector2 } from "three";

const { location } = defineProps<{
  location: [number, number];
}>();

const { camera, renderer } = useTresContext();

const dotPos = positionAtCoordinate(location[0], location[1]);
const dotLook = positionAtCoordinate(location[0], location[1], 1);

function getScreenSpaceCoordinates(): Vector2 {
  if (camera.value == undefined) return new Vector2(0, 0);

  const journeyPos = positionAtCoordinate(...location);
  const width = renderer.value.domElement.width;
  const height = renderer.value.domElement.height;
  return worldToScreen(journeyPos, camera.value, width, height);
}

defineEmits<{
  (e: 'click', v: Vector2): void
}>()

</script>

<template>
  <TresMesh :position="dotPos" :look-at="dotLook" @click="$emit('click', getScreenSpaceCoordinates())">
    <TresCircleGeometry :args="[.01, 32]" />
    <TresMeshBasicMaterial color="red" />
  </TresMesh>
</template>

<style scoped>

</style>