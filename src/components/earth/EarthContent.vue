<script setup lang="ts">
import { computed, shallowRef } from "vue";
import {
  DataTexture,
  Euler,
  LinearSRGBColorSpace,
  MeshLambertMaterial,
  Quaternion,
  Spherical,
  TextureLoader,
  Vector3,
} from "three";
import { type TresInstance, useLoop } from "@tresjs/core";
import waterMap from "@assets/earth/2k_earth_bw.jpg";
import JourneyPoint from "./JourneyPoint.vue";
import { useMouse, usePreferredDark, useWindowSize } from "@vueuse/core";
import { toRadians } from "chart.js/helpers";
import type { Journey } from "@utils/types.ts";
import { getColorProperty } from "@utils/color.ts";

const { journeys } = defineProps<{
  journeys: Journey[];
}>();

const { onBeforeRender } = useLoop();
const prefersDark = usePreferredDark();

// option for devs: moves light source with cursor
const interactive = true;

// the earth

function getEarthMaterial() {
  // create gradient texture based on bg colors
  const bg = getColorProperty(
    prefersDark.value ? "bg-dark" : "bg",
  ).value.toJSON().coords;
  const earth = getColorProperty(
    prefersDark.value ? "bg-2-dark" : "bg-2",
  ).value.toJSON().coords;

  // colors must be vec4 (rgba)
  const gradientData = new Uint8Array(
    [...bg, 1, ...earth, 1].map((c) => Math.trunc(c * 255)),
  );

  const gradientTexture = new DataTexture(gradientData, 2, 1);
  gradientTexture.needsUpdate = true;
  // TODO colorjs is in srgb, but explicitly setting linear srgb here seems to be correct??
  gradientTexture.colorSpace = LinearSRGBColorSpace; //bg.value.spaceId;

  // black-white texture for water vs land
  const earthTexture = new TextureLoader().load(waterMap.src);

  // we patch the existing lambert material for our use case
  // we map the bw water texture multiplied with shadows to the gradient
  return new MeshLambertMaterial({
    map: earthTexture,
    onBeforeCompile: (shader) => {
      shader.uniforms = {
        ...shader.uniforms,
        gradientTexture: { value: gradientTexture },
      };

      // language=Glsl
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <common>",
        `
        uniform sampler2D gradientTexture;
        #include <common>
      `,
      );

      // language=Glsl
      const fragmentShader = `
        #include <dithering_fragment>

        vec4 bwColor = texture2D(map, vMapUv);
        float intensity = bwColor.r * reflectedLight.directDiffuse.r;

        vec4 bg = texture2D(gradientTexture, vec2(0.0, 0.5));
        vec4 fg = texture2D(gradientTexture, vec2(1.0, 0.5));
        gl_FragColor = mix(bg, fg, intensity);
      `;
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <map_fragment>",
        "",
      );
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <dithering_fragment>",
        fragmentShader,
      );
    },
  });
}

const earthRadius = 0.5;
const earthMaterial = computed(getEarthMaterial);

// camera setup

const cameraPosSpherical = new Spherical(
  1.1,
  (0.6 * Math.PI) / 2,
  0.5 * Math.PI,
);
const cameraPos = new Vector3().setFromSpherical(cameraPosSpherical);

// directional light

const { x, y } = useMouse();
const { width, height } = useWindowSize();

const light = shallowRef<TresInstance>();

const lightPos = new Vector3();
lightPos.setFromSphericalCoords(
  cameraPosSpherical.radius,
  cameraPosSpherical.phi,
  cameraPosSpherical.theta - 0.33 * Math.PI,
);

// rotate earth

const earthRef = shallowRef<TresInstance | null>(null);

onBeforeRender(({ delta, elapsed }) => {
  if (earthRef.value == null) {
    return;
  }

  const axialTilt = new Quaternion().setFromEuler(
    new Euler(toRadians(23), 0, 0),
  );
  const day = new Quaternion().setFromEuler(
    new Euler(0, toRadians(elapsed * 5), 0),
  );
  const year = new Quaternion().setFromEuler(
    new Euler(0, toRadians(elapsed), 0),
  );

  const rotation = new Quaternion();
  rotation.multiply(year);
  rotation.multiply(axialTilt);
  rotation.multiply(day);

  earthRef.value.rotation.setFromQuaternion(rotation);

  if (interactive) {
    const lerp = (a: number, b: number, t: number) => a * (1 - t) + b * t;

    // change a and b values in lerp call to change behaviour

    const lightY =
      lerp(-0.2, 0.2, y.value / height.value) + cameraPosSpherical.phi;

    const deltaZ = lerp(-1, 0, x.value / width.value) * 0.33;
    const lightZ = cameraPosSpherical.theta + deltaZ * Math.PI;

    lightPos.setFromSphericalCoords(cameraPosSpherical.radius, lightY, lightZ);

    light.value?.position.copy(lightPos);
  }
});
</script>

<template>
  <TresPerspectiveCamera :position="cameraPos" :look-at="[0, 0, 0]" />
  <TresDirectionalLight
    ref="light"
    :intensity="5"
    :look-at="[0, 0, 0]"
    :position="lightPos"
  />

  <TresGroup ref="earthRef">
    <TresMesh :material="earthMaterial">
      <TresSphereGeometry :args="[earthRadius, 64, 64]" />
    </TresMesh>

    <JourneyPoint v-for="j in journeys" v-bind="j" />
  </TresGroup>
</template>
