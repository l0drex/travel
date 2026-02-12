import { computed, type ComputedRef } from "vue";
import { getFeatureByName } from "@utils/geoJson.ts";
import { useUrlTitle } from "@utils/title.ts";
import type { GeoJSON } from "geojson";

export function useCurrentGeoFeature(geoJson: GeoJSON): ComputedRef<GeoJSON> {
  const currentUrlTitle = useUrlTitle();

  const feature = computed(() => {
    if (currentUrlTitle.value == null) {
      return geoJson;
    }

    const f = getFeatureByName(currentUrlTitle.value, geoJson);
    if (f == null) {
      return geoJson;
    }
    return f;
  });

  return feature;
}
