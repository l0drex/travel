import alt from "@assets/alt.json";
import type {CollectionEntry} from "astro:content";
import Color from "colorjs.io";

export function dateFormatter(date: Date, short: boolean = false) {
  return date.toLocaleDateString(undefined, {
    month: short ? 'short' : 'long',
    year: 'numeric'
  })
}

export function getPreviewAlt(journey: CollectionEntry<"posts">) {
  const id = journey.slug;
  
  if (id in alt) {
    return alt[id as keyof typeof alt];
  }

  console.warn(`Preview image of journey ${id} has no alt text`);
  return ""
}

export function getColorProperty(name: string) {
  const style = getComputedStyle(document.documentElement);
  const prop = style.getPropertyValue(`--color-${name}`);
  let color = new Color(prop);
  color = color.to("srgb")
  return color;
}


export function getColorPropertyString(name: string): string {
  const color = getColorProperty(name).toString();
  return color;
}

export function getColorPropertyArray(name: string) {
  const color = getColorProperty(name).toJSON();
  const colors = color.coords;
  colors.push(1);
  return colors;
}