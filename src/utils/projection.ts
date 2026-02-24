import { MathUtils, Vector2 } from "three";
import { point } from "@turf/turf";
import { toMercator, toWgs84 } from "@turf/turf";
import type { Position } from "geojson";

type LonLat = [number, number]; // [lonDeg, latDeg]
type Ring = LonLat[];
type Area = Ring[]; // polygon: [outerRing, ...holes]

type Projector = {
  name: "mercator";
  project: (p: LonLat) => Position;
  unproject: (v: Vector2) => LonLat;
  projectArea: (area: Area) => Position[][];
  unprojectArea: (rings: Vector2[][]) => Area;
};

// Wrap lon degrees to [-180, +180)
function wrapLonDeg(lon: number) {
  return MathUtils.euclideanModulo(lon + 180, 360) - 180;
}

// Unwrap a ring so lon doesn’t jump across the antimeridian (keeps continuity)
function unwrapRingDegrees(ring: Ring): Ring {
  if (ring.length === 0) return ring;

  const out: Ring = [ring[0]];
  let prevLon = ring[0][0];

  for (let i = 1; i < ring.length; i++) {
    let [lon, lat] = ring[i];

    // shift lon by ±360 to minimize jump vs previous lon
    while (lon - prevLon > 180) lon -= 360;
    while (lon - prevLon < -180) lon += 360;

    out.push([lon, lat]);
    prevLon = lon;
  }
  return out;
}

function unwrapAreaDegrees(area: Area): Area {
  return area.map(unwrapRingDegrees);
}

/**
 * Mercator via Turf:
 * - forward: lon/lat degrees -> EPSG:3857 (meters)
 * - inverse: EPSG:3857 -> lon/lat degrees
 */
export function makeMercatorProjector(options?: {
  unwrapAntimeridian?: boolean;
  maxLatDeg?: number; // avoid poles; keeps projection finite
}): Projector {
  const unwrap = options?.unwrapAntimeridian ?? true;
  const maxLatDeg = options?.maxLatDeg ?? 85.05112878;

  const project = ([lonDeg, latDeg]: LonLat) => {
    const lat = MathUtils.clamp(latDeg, -maxLatDeg, maxLatDeg);
    const p = toMercator(point([lonDeg, lat]));
    return p.geometry.coordinates;
  };

  const unproject = (v: Vector2): LonLat => {
    const p = toWgs84(point([v.x, v.y]));
    const [lon, lat] = p.geometry.coordinates;
    return [wrapLonDeg(lon), lat];
  };

  const projectArea = (area: Area) => {
    const a = unwrap ? unwrapAreaDegrees(area) : area;
    return a.map((ring) => ring.map(project));
  };

  const unprojectArea = (rings: Vector2[][]): Area => {
    return rings.map((ring) => ring.map(unproject));
  };

  return { name: "mercator", project, unproject, projectArea, unprojectArea };
}
