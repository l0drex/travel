<script lang="ts" setup>
import { getColorPropertyString } from "@utils/color.js";

// tailwind colors
const bg = getColorPropertyString("bg");
const bgDark = getColorPropertyString("bg-dark");
const bg2 = getColorPropertyString("bg-2");
const bg2Dark = getColorPropertyString("bg-2-dark");
</script>

<template>
  <svg
    class="h-screen w-screen"
    viewBox="0 5 100 90"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="earthGradient">
        <stop :stop-color="bg2" offset="0%"></stop>
        <stop :stop-color="bg" offset="100%"></stop>
      </linearGradient>

      <linearGradient id="earthGradientDark">
        <stop :stop-color="bg2Dark" offset="0%"></stop>
        <stop :stop-color="bgDark" offset="100%"></stop>
      </linearGradient>
    </defs>

    <circle
      class="fill-[url(#earthGradient)] dark:fill-[url(#earthGradientDark)]"
      cx="50"
      cy="50"
      r="50"
    ></circle>
  </svg>
</template>
