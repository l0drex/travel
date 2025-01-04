<script setup lang="ts">
import {LineChart} from "vue-chart-3";
import {computed, reactive, ref} from "vue";
import {getDistance, getElevation, getPoints, reduceSize} from "@utils/geoJson.ts";
import type {GeoJSON} from "geojson";
import colors from "tailwindcss/colors";
import type {CartesianScaleOptions, ChartOptions} from "chart.js";
import {usePreferredDark} from "@vueuse/core";
import type {_DeepPartialObject} from "chart.js/types/utils";

const {geoJson, trackColor} = defineProps<{
  geoJson: GeoJSON,
  trackColor: string,
}>();

const points = getPoints(geoJson);
const elevation = getElevation(points);

function getLabels() {
  let distances = points.map((k, i) => getDistance(k, points[i - 1]));

  // accumulate distances
  let lastProgress = 0;
  return distances.map((d, i) => {
    let p = (i === 0) ? 0 : d + lastProgress;
    lastProgress = p;
    return `${Math.round(p)} km`;
  });
}

const data = ref({
  labels: reduceSize(getLabels(), 300),
  datasets: [{
    label: 'Elevation',
    data: reduceSize(elevation, 300)
  }]
});

const darkMode = usePreferredDark();

const options = computed<ChartOptions<"line">>(() => {
  const labelColor = colors.stone["500"];
  const lineColor = darkMode.value ? colors.stone["800"] : colors.stone["300"];

  const axisConf: _DeepPartialObject<CartesianScaleOptions> = {
    grid: {
      color: lineColor,
    },
    ticks: {
      color: labelColor,
    },
  };
  
  return {
    borderColor: trackColor, 
    backgroundColor: trackColor,
    elements: {
      point: {
        radius: 0
      }
    },
    plugins: {
      title: {
        display: true,
        text: "Höhenprofil",
        color: labelColor
      },
      legend: {
        display: false
      },
    },
    scales: {
      x: axisConf,
      y: {
        ...axisConf,
        ticks: {
          callback: (value: number) => `${value} m`
        }
      }
    }
  }
});

</script>

<template>
  <LineChart :chart-data="data" :options="options" :height="200"/>
</template>

<style scoped>

</style>