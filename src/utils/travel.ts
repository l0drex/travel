import { MathUtils, Vector3 } from "three";
import type {
  GeoJSON,
  Position,
} from "geojson";
import {degToRad} from "three/src/math/MathUtils";

export type JourneyType = "bike" | "hiking";

export interface Journey {
  title: string;
  url: string;
  type: JourneyType;
  date: Date;
  location: [number, number];
}

export function getPoints(geoJson: GeoJSON): Position[] {
  if (geoJson.type === "FeatureCollection") {
    return geoJson.features.map((f) => getPoints(f)).flat(1);
  }

  if (geoJson.type === "Feature") {
    return getPoints(geoJson.geometry);
  }

  switch (geoJson.type) {
    case "LineString":
      return geoJson.coordinates;
    case "MultiLineString":
      return geoJson.coordinates.flat(1);
    default:
      return [];
  }
}

export function reduceSize(array: never[], targetLength: number) {
  if (targetLength < 0) return array;

  if (array.length === targetLength) {
    return array;
  }

  const relation = Math.round(array.length / targetLength);
  const filtered = array.filter((_, i) => i % relation === 0);

  return filtered;
}

export function getElevation(points: Position[]) {
  return points.map((p) => p[2]);
}

export function getDistance(a: Position, b: Position) {
  if (a == null || b == null) return 0;

  const lat1 = a[0];
  const lon1 = a[1];
  const lat2 = b[0];
  const lon2 = b[1];

  const R = 6371; // Radius of the earth in km
  const dLat = degToRad(lat2 - lat1); // deg2rad below
  const dLon = degToRad(lon2 - lon1);
  const a_ =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degToRad(lat1)) *
      Math.cos(degToRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a_), Math.sqrt(1 - a_));
  const d = R * c; // Distance in km

  return d;
}

export function positionAtCoordinate(
  latitude: number,
  longitude: number,
  r: number = 0.5,
) {
  const vec = new Vector3();
  const phi = MathUtils.degToRad(-latitude) + Math.PI / 2;
  const theta = MathUtils.degToRad(longitude) + Math.PI / 2;

  vec.setFromSphericalCoords(r, phi, theta);
  return vec;
}

export const travelLight = [255, 246, 208, 255];
//export const travelDark = [39, 38, 71, 255];
export const travelDark = [0, 0, 0, 255];
//export const earthColor = [232, 151, 111, 255];
export const earthDarkColor = [18, 18, 18, 255];
export const earthLightColor = [238, 229, 196, 255];

export function arrayToColor(array: number[]) {
  return `rgb(${array.join(", ")})`;
}
