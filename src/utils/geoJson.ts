import { MathUtils, Vector3 } from "three";
import type { GeoJSON, Position } from "geojson";
import { coordAll, flatten } from "@turf/turf";

export function getFeatureByName(
  name: string,
  geoJson: GeoJSON,
): GeoJSON | null {
  // types are not compatible somehow
  for (const f of flatten(geoJson as any).features) {
    if (f.properties == null) {
      continue;
    }

    if (f.properties["name"] === name) {
      return f;
    }
  }

  return null;
}

export function getPointsOf(name: string, geoJson: GeoJSON): Position[] {
  const f = getFeatureByName(name, geoJson);
  if (f == null) {
    return [];
  }

  return coordAll(f);
}

export function reduceSize<T extends { y: number }>(
  array: T[],
  precision: number,
) {
  const filtered = [array[0]];

  let last = array[0];
  for (const v of array) {
    if (Math.abs(v.y - last.y) < precision) continue;
    filtered.push(v);
    last = v;
  }
  return filtered;
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
