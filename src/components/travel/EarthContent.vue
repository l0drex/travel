<script setup lang="ts">
import { computed, type ShallowRef, shallowRef } from "vue";
import { DataTexture, RGBAFormat, ShaderMaterial, Spherical, TextureLoader, type Vector2, Vector3 } from "three";
import { type TresInstance, useTresContext } from "@tresjs/core";
import { OrbitControls } from "@tresjs/cientos";
import {
  earthDarkColor,
  earthLightColor,
  type Journey,
  type JourneyScreen,
  travelDark,
  travelLight
} from "@utils/travel.ts";
import color from "@assets/travel/2k_earth_bw.jpg";
import JourneyPoint from "./JourneyPoint.vue";
import { usePreferredDark } from "@vueuse/core";

const emit = defineEmits<{
  (e: 'journeySelected', journey: JourneyScreen): void
}>();

// the earth

function getEarthMaterial() {
  const earthTexture = new TextureLoader().load(color.src);

  const prefersDark = usePreferredDark();

  const gradientData = new Uint8Array([
    ...(prefersDark.value ? travelDark : travelLight),
    ...(prefersDark.value ? earthDarkColor : earthLightColor)
  ])
  const gradientTexture = new DataTexture(gradientData, 2, 1, RGBAFormat);
  gradientTexture.needsUpdate = true;

  const earthMaterial = new ShaderMaterial({
    uniforms: {
      bwTexture: {value: earthTexture},
      gradientTexture: {value: gradientTexture}
    },
    vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
    fragmentShader: `
                uniform sampler2D bwTexture;
                uniform sampler2D gradientTexture;
                varying vec2 vUv;
                void main() {
                    vec4 bwColor = texture2D(bwTexture, vUv);
                    float intensity = bwColor.r; // assuming the texture is grayscale
                    vec4 gradientColor = texture2D(gradientTexture, vec2(intensity, 0.5));
                    gl_FragColor = gradientColor;
                }
            `
  });

  return earthMaterial;
}

const earthRadius = .5;
const earthMaterial = getEarthMaterial();


// camera setup

const initialCameraPos = new Vector3();
initialCameraPos.setFromSphericalCoords(2, .6 * Math.PI / 2, .5 * Math.PI);

const {camera} = useTresContext();
const currentCameraPos = computed(() => {
  // convert to spherical
  const p = new Spherical();
  p.setFromVector3(camera.value?.position ?? initialCameraPos);
  return p;
})


// light that follows the camera position

const lightPos = new Vector3();
lightPos.setFromSphericalCoords(currentCameraPos.value.radius, currentCameraPos.value.phi, currentCameraPos.value.theta - .25 * Math.PI);

const light: ShallowRef<TresInstance | null> = shallowRef(null);

function onChange() {
  if (light.value == null) return;
  light.value.position.setFromSphericalCoords(currentCameraPos.value.radius, currentCameraPos.value.phi, currentCameraPos.value.theta - .25 * Math.PI);
}

const {journeys} = defineProps<{
  journeys: Journey[]
}>();

function emitClick(v: Vector2, j: Journey) {
  const js: JourneyScreen = {
    ...j,
    screenSpace: v
  }

  emit('journeySelected', js);
}
</script>

<template>
  <TresPerspectiveCamera
      :position="initialCameraPos"
      :look-at="[0, 0, 0]"
  />
  <TresMesh :material="earthMaterial">
    <TresSphereGeometry :args="[earthRadius, 64, 64]"/>
  </TresMesh>

  <JourneyPoint v-for="j in journeys" :location="j.location" @click="v => emitClick(v, j)"/>

  <TresDirectionalLight :intensity="5" :position="lightPos" ref="light" :look-at="[0, 0, 0]"/>
  <OrbitControls @change="onChange"/>
</template>

<style scoped>
</style>