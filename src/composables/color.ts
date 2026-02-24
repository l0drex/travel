import { computed, type ComputedRef, onMounted, ref } from "vue";
import Colorjs from "colorjs.io";
import { Color } from "three";
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
    const colorjs = new Colorjs(currentColor).to("srgb");
    color = new Color().setRGB(colorjs.r!, colorjs.g!, colorjs.b!);
  } else {
    throw new Error("Could not find color");
  }

  return color;
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

    const colorjs = new Colorjs(prop).to("srgb");
    color.value = new Color().setRGB(colorjs.r!, colorjs.g!, colorjs.b!);
  });

  return color;
}

export function getColorPropertyString(name: string): ComputedRef<string> {
  const color = getColorProperty(name);

  return computed(() => `#${color.value.getHexString()}`);
}

export function getColorPropertyArray(name: string) {
  const color = getColorProperty(name);

  return computed(() => {
    let c = color.value;
    return c.toArray();
  });
}
