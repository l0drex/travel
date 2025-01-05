import alt from "@assets/alt.json";
import type {CollectionEntry} from "astro:content";
import {Color} from "three";

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

export function colorStringToArray(color: string) {
  const colorObj = new Color(color);
  colorObj.convertLinearToSRGB();
  
  const colorArray = colorObj
      .toArray()
      // map 0,1 to 0,255
      .map(c => Math.round(c * 255.0));
  // add alpha
  colorArray.push(255);
  
  return colorArray;
}