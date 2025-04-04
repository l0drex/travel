import { computed, type ComputedRef, onMounted, ref } from "vue";
import Color from "colorjs.io";
import twconfig from "../../tailwind.config.mts";

const colors = twconfig.theme.extend.colors;

function getColorFromConfig(name: string): Color {
  let color = new Color("#f0f");

  const path = name.split("-");

  let currentColor: any = colors;
  for (let p of path) {
    if (typeof currentColor !== "object") {
      throw new Error("Error while parsing color");
    }

    currentColor = currentColor[p];
  }

  if (typeof currentColor !== "string") {
    currentColor = currentColor["DEFAULT"];
  }

  if (typeof currentColor === "string") {
    color = new Color(currentColor);
  } else {
    throw new Error("Could not find color");
  }

  return color.to("srgb").toGamut();
}

export function getColorProperty(name: string) {
  const color = ref(getColorFromConfig(name));

  onMounted(() => {
    const style = getComputedStyle(document.documentElement);
    const prop = style.getPropertyValue(`--color-${name}`);

    if (prop == "") {
      console.error("Color must not be empty");
      return;
    }

    color.value = new Color(prop).to("srgb").toGamut();
  });

  return color;
}

export function getColorPropertyString(name: string): ComputedRef<string> {
  const color = getColorProperty(name);

  return computed(() => color.value.toString());
}

export function getColorPropertyArray(name: string) {
  const color = getColorProperty(name);

  return computed(() => {
    let c = color.value.toJSON();
    const colors = c.coords;

    return colors;
  });
}
