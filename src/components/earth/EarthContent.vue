<script setup lang="ts">
import {computed, shallowRef} from "vue";
import {
  DataTexture,
  Euler,
  MeshLambertMaterial,
  Quaternion,
  RGBAFormat,
  Spherical,
  TextureLoader,
  Vector3
} from "three";
import {type TresInstance, useLoop} from "@tresjs/core";
import {colorArray, colors} from "@utils/theme.ts";
import color from "@assets/earth/2k_earth_bw.jpg";
import JourneyPoint from "./JourneyPoint.vue";
import {usePreferredDark} from "@vueuse/core";
import {toRadians} from "chart.js/helpers";
import type {Journey} from "@utils/types.ts";

const {onBeforeRender} = useLoop();
const prefersDark = usePreferredDark();

// the earth

function getEarthMaterial() {
  const earthTexture = new TextureLoader().load(color.src);
  
  const gradientData = new Uint8Array([
    ...colorArray(prefersDark.value ? colors.dark.bg : colors.light.bg),
    ...colorArray(prefersDark.value ? colors.dark.earth : colors.light.earth)
  ])
  const gradientTexture = new DataTexture(gradientData, 2, 1, RGBAFormat);
  gradientTexture.needsUpdate = true;
  
  // we patch the existing lambert material for our use case
  // we use the bw earth texture to map to foreground and background color
  // and set the lighting color to the alpha
  return new MeshLambertMaterial({
    map: earthTexture,
    onBeforeCompile: (shader) => {
      shader.uniforms = ({
        ...shader.uniforms,
        gradientTexture: {value: gradientTexture}
      })
      
      // language=Glsl
      shader.fragmentShader = shader.fragmentShader.replace("#include <common>", `
        uniform sampler2D gradientTexture;
        #include <common>
      `)
      
      // language=Glsl
      const fragmentShader = `
        #include <dithering_fragment>

        vec4 bwColor = texture2D(map, vMapUv);
        float intensity = bwColor.r;  // assuming the texture is grayscale
        vec4 gradientColor = texture2D(gradientTexture, vec2(intensity, 0.5));
        gradientColor.a = reflectedLight.directDiffuse.r * intensity;
        gl_FragColor = gradientColor;
      `
      shader.fragmentShader = shader.fragmentShader.replace("#include <map_fragment>", "");
      shader.fragmentShader = shader.fragmentShader.replace("#include <dithering_fragment>", fragmentShader);
    }
  });
}

const earthRadius = .5;
const earthMaterial = computed(getEarthMaterial);


// camera setup

const cameraPosSpherical = new Spherical(1.1, .6 * Math.PI / 2, .5 * Math.PI);
const cameraPos = new Vector3().setFromSpherical(cameraPosSpherical);


// light that follows the camera position

const lightPos = new Vector3();
lightPos.setFromSphericalCoords(cameraPosSpherical.radius, cameraPosSpherical.phi, cameraPosSpherical.theta - .33 * Math.PI);

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