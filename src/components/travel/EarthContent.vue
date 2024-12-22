<script setup lang="ts">
import {shallowRef} from "vue";
import {
  DataTexture, Euler,
  Quaternion,
  RGBAFormat,
  ShaderMaterial,
  Spherical,
  TextureLoader,
  Vector3
} from "three";
import {type TresInstance, useLoop} from "@tresjs/core";
import {earthDarkColor, earthLightColor, type Journey, travelDark, travelLight} from "@utils/travel.ts";
import color from "@assets/travel/2k_earth_bw.jpg";
import JourneyPoint from "./JourneyPoint.vue";
import {usePreferredDark} from "@vueuse/core";
import {toRadians} from "chart.js/helpers";

const {onBeforeRender} = useLoop();

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
  
  return new ShaderMaterial({
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
}

const earthRadius = .5;
const earthMaterial = getEarthMaterial();


// camera setup

const cameraPosSpherical = new Spherical(1.1, .6 * Math.PI / 2, .5 * Math.PI);
const cameraPos = new Vector3().setFromSpherical(cameraPosSpherical);


// light that follows the camera position

const lightPos = new Vector3();
lightPos.setFromSphericalCoords(cameraPosSpherical.radius, cameraPosSpherical.phi, cameraPosSpherical.theta - .25 * Math.PI);

// rotate earth

const earthRef = shallowRef<TresInstance | null>(null);

onBeforeRender(({ delta, elapsed }) => {
  if (earthRef.value == null) {
    return;
  }
  
  const axialTilt = new Quaternion().setFromEuler(new Euler(
      toRadians(23), 0, 0));
  const day = new Quaternion().setFromEuler(new Euler(
      0, toRadians(elapsed * 5), 0));
  const year = new Quaternion().setFromEuler(new Euler(
      0, toRadians(elapsed), 0));
    
  const rotation = new Quaternion();
  rotation.multiply(year);
  rotation.multiply(axialTilt);
  rotation.multiply(day);
  
  earthRef.value.rotation.setFromQuaternion(rotation);
});

const {journeys} = defineProps<{
  journeys: Journey[]
}>();
</script>

<template>
  <TresPerspectiveCamera :position="cameraPos" :look-at="[0, 0, 0]"/>
  <TresDirectionalLight :intensity="5" :position="lightPos" :look-at="[0, 0, 0]"/>
  
  <TresGroup ref="earthRef">
    <TresMesh :material="earthMaterial">
      <TresSphereGeometry :args="[earthRadius, 64, 64]"/>
    </TresMesh>

    <JourneyPoint v-for="j in journeys" :location="j.location"/>
  </TresGroup>
</template>

<style scoped>
</style>