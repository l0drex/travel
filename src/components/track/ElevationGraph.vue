<script setup lang="ts">
import { LineChart } from "vue-chart-3";
import { computed } from "vue";
import { getPointsOf, reduceSize } from "@utils/geoJson.ts";
import type { GeoJSON, Position } from "geojson";
import {
  type CartesianScaleOptions,
  Chart,
  type ChartData,
  type ChartOptions,
  registerables,
} from "chart.js";
import { usePreferredDark } from "@vueuse/core";
import type { _DeepPartialObject } from "chart.js/types/utils";
import { getColorPropertyString } from "@utils/color.ts";
import { useUrlTitle } from "@utils/title.ts";
import { coordAll, distance } from "@turf/turf";
import { useCurrentGeoFeature } from "@utils/currentGeoFeature.ts";
import type { Item } from "tinyqueue";

const fgInactive = getColorPropertyString("fg-inactive");
const fgInactiveDark = getColorPropertyString("fg-inactive-dark");
const line = getColorPropertyString("line");
const lineDark = getColorPropertyString("line-dark");
const primary = getColorPropertyString("primary");
const secondary = getColorPropertyString("secondary");

Chart.register(...registerables);

const { geoJson, isCollection } = defineProps<{
  geoJson: GeoJSON;
  isCollection: boolean;
}>();

const currentUrlTitle = useUrlTitle();
const currentFeature = useCurrentGeoFeature(geoJson);

const showGraph = computed(() => {
  /*
   * roadtrip is expected to be a collection of small unconnected hiking tracks and points,
   * therefore elevation data makes no sense here
   */
  if (isCollection && currentUrlTitle.value == null) {
    return false;
  }

  // Points have no elevation data either
  if (
    currentFeature.value.type == "Feature" &&
    currentFeature.value.geometry.type == "Point"
  ) {
    return false;
  }

  return true;
});

// collect coordinates in geo json
const coordinates = coordAll(currentFeature.value);
// convert to types for chart
const elevationData = toData(coordinates);
// reduce size
const elevationReduced = reduceSize(elevationData, 10);

const title = useUrlTitle();
const elevationTodayReduced = computed(() => {
  if (title.value == null) {
    return [];
  }

  const coords = getPointsOf(title.value, currentFeature.value);
  const startIndex = coordinates.findIndex((c) => coords[0] === c);
  const endIndex = coordinates.findIndex(
    (c) => coords[coords.length - 1] === c,
  );

  const elev = elevationData.toSpliced(0, startIndex);
  elev.length = endIndex - startIndex;

  return reduceSize(elev, 10);
});

function toData(points: Position[]) {
  let distances = points.map((k, i) => {
    if (i === 0) return 0;
    return distance(k, points[i - 1], { units: "kilometers" });
  });

  // accumulate distances
  let lastProgress = 0;
  let progress = distances.map((d, i) => {
    let p = i === 0 ? 0 : d + lastProgress;
    lastProgress = p;
    return p;
  });

  return points.map((point, i) => ({ x: progress[i], y: point[2] }));
}

const data = computed<ChartData<"line">>(() => ({
  datasets: [
    {
      label: "Elevation of selected day",
      data: elevationTodayReduced.value,
      borderColor: secondary.value,
      fill: "origin",
      tension: 0.1,
    },
    {
      label: "Elevation Total",
      data: elevationReduced,
      borderColor: primary.value,
      fill: "origin",
      tension: 0.1,
    },
  ],
}));

const darkMode = usePreferredDark();

const options = computed<ChartOptions<"line">>(() => {
  const labelColor = (darkMode.value ? fgInactiveDark : fgInactive).value;
  const lineColor = (darkMode.value ? line : lineDark).value;

  const axisConf: _DeepPartialObject<CartesianScaleOptions> = {
    grid: {
      display: false,
    },
    ticks: {
      color: labelColor,
    },
  };

  return {
    elements: {
      point: {
        radius: 0,
      },
    },
    plugins: {
      title: {
        display: true,
        text: "Höhenprofil",
        color: labelColor,
      },
      legend: {
        display: false,
      },
      tooltip: {
        intersect: false,
        callbacks: {
          title(tooltipItems: Item[]): string | string[] | void {
            return `Distanz: ${tooltipItems[0].label} km`;
          },
          label(tooltipItem: Item): string | string[] | void {
            return `Höhe: ${tooltipItem.formattedValue} m`;
          },
        },
      },
    },
    scales: {
      x: {
        ...axisConf,
        type: "linear",
        ticks: {
          ...axisConf.ticks,
          stepSize: 20,
          callback: (value: number) => `${value} km`,
        },
      },
      y: {
        ...axisConf,
        ticks: {
          ...axisConf.ticks,
          callback: (value: number) => `${value} m`,
        },
      },
    },
  };
});
</script>

<template>
  <LineChart
    v-if="showGraph"
    :chart-data="data"
    :options="options"
    :height="150"
  />
</template>

<style scoped></style>
