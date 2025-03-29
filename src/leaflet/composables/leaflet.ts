import { ref, watch } from "vue";
import L from "leaflet";
import markerIconUrl from "leaflet/dist/images/marker-icon.png";
import markerIconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import markerShadowUrl from "leaflet/dist/images/marker-shadow.png";

// fix no icons in build
L.Icon.Default.prototype.options.iconUrl = markerIconUrl.src;
L.Icon.Default.prototype.options.iconRetinaUrl = markerIconRetinaUrl.src;
L.Icon.Default.prototype.options.shadowUrl = markerShadowUrl.src;
L.Icon.Default.imagePath = "";

const map = ref<L.Map>();

export function useLeaflet() {
  const onMapReady = (callback: Function) => {
    watch(
      map,
      () => {
        if (map.value == null) {
          return;
        }

        callback();
      },
      { immediate: true },
    );
  };

  return {
    map,
    onMapReady,
  };
}
