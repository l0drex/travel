import { MathUtils, Vector3 } from "three";
import type {
  GeoJSON,
  Position,
} from "geojson";
import {degToRad} from "three/src/math/MathUtils";

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

export function reduceSize<T extends {y: number}>(array: T[], precision: number) {
  const filtered = [array[0]]
  
  let last = array[0];
  for (const v of array) {
    if (Math.abs(v.y - last.y) < precision) continue;
    filtered.push(v);
    last = v;
  }
  return filtered;
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
