<script setup lang="ts">
import {LineChart} from "vue-chart-3";
import {computed, ref} from "vue";
import {getDistance, getPoints, reduceSize} from "@utils/geoJson.ts";
import type {GeoJSON, Position} from "geojson";
import {type CartesianScaleOptions, Chart, type ChartData, type ChartOptions, registerables} from "chart.js";
import {usePreferredDark} from "@vueuse/core";
import type {_DeepPartialObject} from "chart.js/types/utils";
import {getColorPropertyString} from "@utils/color.ts";

const fgInactive = getColorPropertyString("fg-inactive");
const fgInactiveDark = getColorPropertyString("fg-inactive-dark");
const line = getColorPropertyString("line");
const lineDark = getColorPropertyString("line-dark");
const primary = getColorPropertyString("primary");

Chart.register(...registerables);

const {geoJson} = defineProps<{
  geoJson: GeoJSON,
}>();

// collect coordinates in geo json
const coordinates = getPoints(geoJson);
// convert to types for chart
const elevationData = toData(coordinates);
// reduce size
const elevationReduced = reduceSize(elevationData, 10);

function toData(points: Position[]) {
  let distances = points.map((k, i) => getDistance(k, points[i - 1]));
  
  // accumulate distances
  let lastProgress = 0;
  let progress = distances
      .map((d, i) => {
        let p = (i === 0) ? 0 : d + lastProgress;
        lastProgress = p;
        return p;
      });
  
  return points.map((point, i) => ({x: progress[i], y: point[2]}))
}

const data = computed<ChartData<"line">>(() => ({
  datasets: [{
    label: 'Elevation',
    data: elevationReduced,
    borderColor: primary.value,
    fill: "origin",
    tension: .1
  }],
}));

const darkMode = usePreferredDark();

const options = computed<ChartOptions<"line">>(() => {
  const labelColor = (darkMode.value ? fgInactiveDark : fgInactive).value;
  const lineColor = (darkMode.value ? line : lineDark).value;

  const axisConf: _DeepPartialObject<CartesianScaleOptions> = {
    grid: {
      color: lineColor,
    },
    ticks: {
      color: labelColor,
    },
  };
  
  return {
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
      x: {
        ...axisConf,
        type: "linear",
        ticks: {
          ...axisConf.ticks,
          stepSize: 20,
          callback: (value: number) => `${value} km`
        }
      },
      y: {
        ...axisConf,
        ticks: {
          ...axisConf.ticks,
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
