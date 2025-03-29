import { ref, watch } from "vue";
import L from "leaflet";
import markerIconUrl from "@assets/marker.svg";
import markerShadowUrl from "leaflet/dist/images/marker-shadow.png";

// fix no icons in build
L.Icon.Default.prototype.options.iconUrl = markerIconUrl.src;
L.Icon.Default.prototype.options.iconSize = [48, 48];
L.Icon.Default.prototype.options.iconAnchor = [48 / 2, 48 - 4];
L.Icon.Default.prototype.options.iconRetinaUrl = markerIconUrl.src;
L.Icon.Default.prototype.options.shadowUrl = markerShadowUrl.src;
L.Icon.Default.prototype.options.shadowSize = [48, 48];
L.Icon.Default.prototype.options.shadowAnchor = [48 / 2 - 6, 48];
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
