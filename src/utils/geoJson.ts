import { MathUtils, Vector3 } from "three";
import type { Feature, FeatureCollection, GeoJSON, Position } from "geojson";
import {
  booleanIntersects,
  coordAll,
  coordEach,
  distance,
  featureEach,
  flatten,
  length,
  lineString,
  simplify,
} from "@turf/turf";
import { StatId } from "@utils/types.ts";
import countryCodes from "country-codes-list";

export function getFeatureByName(
  name: string,
  geoJson: GeoJSON,
): Feature | null {
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

function formatName(name: string) {
  // src: https://github.com/georgique/world-geojson/blob/develop/index.ts
  if (!name) throw new Error("missing parameter for formatName");

  return name
    .replace(/ /g, "_")
    .replace(/\./g, "")
    .replace(/&/g, "and")
    .toLowerCase();
}

export function getVisitedCountries(track: GeoJSON) {
  // import country data
  const countryModules = import.meta.glob(
    "../../node_modules/world-geojson/countries/*.json",
    {
      eager: true,
    },
  ) as Record<string, FeatureCollection>;

  // make sure we have a single feature.
  // todo assumes track is a line.
  const simpleTrack = simplify(lineString(coordAll(track)), {
    tolerance: 0.1,
  });

  const countries = countryCodes.all().filter((country) => {
    // get country data

    let countryModule = Object.entries(countryModules).find(([path, data]) => {
      const formattedName = formatName(country.countryNameEn);
      return path.endsWith(`${formattedName}.json`);
    });

    if (countryModule == null) {
      console.warn(`No data for country ${country.countryNameEn}`);
      return false;
    }
    let geoData = countryModule[1];

    // check if track passes through the country

    let visitsCountry = false;
    try {
      featureEach(geoData, (f) => {
        if (visitsCountry) {
          return;
        }

        if (booleanIntersects(f, simpleTrack)) {
          visitsCountry = true;
        }
      });
    } catch (e) {
      console.error(`Error while checking for ${country.countryNameEn}`);
      console.error(e);
      return false;
    }

    return visitsCountry;
  });

  return countries;
}
