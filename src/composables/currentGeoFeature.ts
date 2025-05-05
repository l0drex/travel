import { computed } from "vue";
import { getFeatureByName } from "@utils/geoJson.ts";
import { useUrlTitle } from "@utils/title.ts";
import type { GeoJSON } from "geojson";

export function useCurrentGeoFeature(geoJson: GeoJSON) {
  const currentUrlTitle = useUrlTitle();

  const feature = computed(() => {
    if (currentUrlTitle.value == null) {
      return geoJson;
    }

    const feature = getFeatureByName(currentUrlTitle.value, geoJson);
    if (feature == null) {
      return geoJson;
    }
    return feature;
  });

  return feature;
}
