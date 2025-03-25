import { reactive, ref, useTemplateRef, watch } from "vue";
import L from "leaflet";

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
