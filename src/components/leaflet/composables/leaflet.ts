import { ref, watch, inject, provide, type Ref, type InjectionKey } from "vue";
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

type OnMapReadyCallback = () => void;

export type LeafletContext = {
  map: Ref<L.Map | undefined>;
  onMapReady: (callback: OnMapReadyCallback) => void;
};

export function provideLeaflet(key: InjectionKey<LeafletContext>) {
  const map = ref<L.Map>();

  const onMapReady = (callback: OnMapReadyCallback) => {
    watch(
      map,
      () => {
        if (map.value == null) return;
        callback();
      },
      { immediate: true },
    );
  };

  const ctx: LeafletContext = { map, onMapReady };
  provide(key, ctx);

  return ctx;
}

export function useLeaflet(key: InjectionKey<LeafletContext>): LeafletContext {
  const ctx = inject(key);
  if (!ctx) {
    throw new Error(
      "useLeaflet() must be used inside a <LeafletMap> component.",
    );
  }
  return ctx;
}
