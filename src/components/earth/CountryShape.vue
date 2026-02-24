<script lang="ts" setup>
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  type ColorRepresentation,
  MeshBasicMaterial,
  Path,
  Shape,
  ShapeGeometry,
  SphereGeometry,
  Vector2,
} from "three";
import countriesGeodata from "@assets/countries.json";
import type { FeatureCollection } from "geojson";
import { positionAtCoordinate } from "@utils/geoJson.ts";
import type { CountryData } from "country-codes-list";
import { makeMercatorProjector } from "@utils/projection";
import { area, center, polygon, simplify } from "@turf/turf";
import { computed } from "vue";
import { LoopSubdivision } from "three-subdivide";

const { country, color } = defineProps<{
  country: CountryData;
  color: ColorRepresentation;
}>();

const resolution = 0.1;
const getSubdivisions = (area: number) => {
  // area is in square meters
  if (area > 9e12) {
    return 1;
  }
  return 0;
};

const shapeGeometries = computed(() => {
  const fallback = [new SphereGeometry(0)];

  // first, get the country shape from the geojson data

  // every country is a multi polygon
  // a multipolygon is an array of polygons
  const countryGeodata = (countriesGeodata as FeatureCollection).features.find(
    (c) => {
      if (
        c.properties!["ISO3166-1-Alpha-2"] == country.countryCode ||
        country.areaCodes?.includes(c.properties!["ISO3166-1-Alpha-2"]) ||
        // remove things like (Republic of) at the end of country names
        c.properties!.name == country.countryNameEn.replace(/\(.*\)/, "").trim()
      ) {
        return true;
      }

      // special cases
      if (
        c.properties!["ISO3166-1-Alpha-2"] === "CN-TW" &&
        country.countryCode === "TW"
      ) {
        return true;
      }

      if (
        c.properties!.name === "Kosovo" &&
        country.countryNameEn === "Republic of Kosovo"
      ) {
        return true;
      }
    },
  );

  if (!countryGeodata) {
    console.error(
      `Could not find shape for country ${country.countryNameEn} (${country.countryCode})`,
    );
    return fallback;
  }

  const simplifiedCountryGeodata = simplify(countryGeodata, {
    tolerance: resolution,
  });

  // areas of the country
  // good test: Canada
  let areas = [];
  switch (countryGeodata.geometry.type) {
    case "MultiPolygon":
      areas = simplifiedCountryGeodata.geometry.coordinates;
      break;
    case "Polygon":
      areas = [simplifiedCountryGeodata.geometry.coordinates];
      break;
    default:
      console.error(
        `Country ${name} has unsupported geometry type ${countryGeodata.geometry.type}`,
      );
      return fallback;
  }

  const shapeGeometries: BufferGeometry[] = [];

  for (const areaGeodata of areas) {
    const surfaceArea = area(polygon(areaGeodata));
    if (surfaceArea < 1e10) {
      continue;
    }

    // area consists of outline [0] and holes (every ring after that)
    // rings are [lon, lat] pairs

    // Project lat/lon -> mercator (EPSG:3857-ish meters)
    const projector = makeMercatorProjector({ unwrapAntimeridian: true });

    const projectedRings = projector.projectArea(areaGeodata);

    // Move projected coordinates into a *local* space (improves numeric stability)
    // We use the outer ring bbox center as origin.
    const outer = projectedRings[0] ?? [];
    if (outer.length < 3) continue;
    const origin = center(polygon([outer])).geometry.coordinates;

    const [outerLocal, ...holesLocal] = projectedRings.map((ring) =>
      ring.map((p) => new Vector2(p[0] - origin[0], p[1] - origin[1])),
    );

    // Build Shape in projected local space (outline + holes)
    const shape = new Shape(outerLocal);
    for (const hole of holesLocal) {
      shape.holes.push(new Path(hole));
    }

    // Triangulate in projected local space

    let geometry: BufferGeometry = new ShapeGeometry(shape, 1);

    // subdivide the geometry
    const subdivisions = getSubdivisions(surfaceArea);
    if (subdivisions > 0) {
      console.debug("subdividing", country.countryNameEn, subdivisions);
      geometry = LoopSubdivision.modify(geometry, subdivisions, {
        preserveEdges: true,
        flatOnly: true,
      });
    }

    // Project back: local mercator vertex -> world mercator -> lon/lat -> sphere xyz
    const vertices = geometry.getAttribute("position") as BufferAttribute;
    for (let i = 0; i < vertices.count; i++) {
      const localX = vertices.getX(i);
      const localY = vertices.getY(i);

      const mercatorX = localX + origin[0];
      const mercatorY = localY + origin[1];

      const [lonDeg, latDeg] = projector.unproject(
        new Vector2(mercatorX, mercatorY),
      );
      const earthCoordinate = positionAtCoordinate(latDeg, lonDeg);

      vertices.setX(i, earthCoordinate.x);
      vertices.setY(i, earthCoordinate.y);
      vertices.setZ(i, earthCoordinate.z);
    }
    vertices.needsUpdate = true;
    geometry.computeVertexNormals();

    shapeGeometries.push(geometry);
  }

  if (shapeGeometries.length == 0) {
    console.debug(
      "country",
      country.countryNameEn,
      "is too small to render, skipping",
    );
  }

  return shapeGeometries;
});

const material = new MeshBasicMaterial({
  color: new Color(color).convertSRGBToLinear(),
  //depthTest: false,
});
</script>

<template>
  <TresGroup>
    <TresMesh
      :args="[geometry, material]"
      v-for="[i, geometry] in shapeGeometries.entries()"
      :key="`${country.countryNameEn}-${i}`"
    />
  </TresGroup>
</template>
