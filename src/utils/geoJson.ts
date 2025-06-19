import { MathUtils, Vector3 } from "three";
import type { GeoJSON, Position } from "geojson";
import { coordAll, coordEach, distance, flatten, length } from "@turf/turf";
import { StatId, statsPrototypes } from "@utils/types.ts";

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

type StatsType = Partial<Record<StatId, number>>;
export function addCalculatedStats(stats: StatsType, geoJson: GeoJSON) {
  // trip length
  if (!(StatId.totalDistance in stats)) {
    stats[StatId.totalDistance] = length(geoJson as any);
  }

  // calculate elevation gained and lost
  // this is the height in meters above sea level,
  // not the distance where elevation was gained or lost
  const minDistance = 0.5; // kilometers
  let elevationUp = 0;
  let elevationDown = 0;
  let lastCoordinate: number[];
  coordEach(geoJson, (currentCoord) => {
    if (!lastCoordinate) {
      lastCoordinate = currentCoord;
      return;
    }

    let elevationDelta = currentCoord[2] - lastCoordinate[2];
    if (distance(lastCoordinate, currentCoord) < minDistance) {
      return;
    }

    if (elevationDelta > 0) {
      elevationUp += elevationDelta;
    } else if (elevationDelta < 0) {
      elevationDown -= elevationDelta;
    }

    lastCoordinate = currentCoord;
  });
  stats[StatId.elevationUp] = elevationUp;
  stats[StatId.elevationDown] = elevationDown;

  // calculate kilometers and time per day
  if (StatId.days in stats) {
    if (StatId.totalDistance in stats) {
      stats[StatId.kmPerDay] =
        stats[StatId.totalDistance] / stats[StatId.days]!;
    }

    if (StatId.totalTime in stats) {
      stats[StatId.timePerDay] = stats[StatId.totalTime]! / stats[StatId.days]!;
    }
  }

  // calculate average speed
  if (StatId.totalDistance in stats && StatId.totalTime in stats) {
    stats[StatId.averageSpeed] =
      stats[StatId.totalDistance] / stats[StatId.totalTime]!;
  }
}
