<script lang="ts" setup>
import {
  BufferAttribute,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  Shape,
  ShapeGeometry,
  SphereGeometry,
  Vector2,
} from "three";
import countryGeodata from "@assets/countries.json";
import type { FeatureCollection, MultiPolygon } from "geojson";
import { positionAtCoordinate } from "@utils/geoJson.ts";
import type { CountryData } from "country-codes-list";
import * as countryCodes from "country-codes-list";
import { OBJExporter } from "three/addons/exporters/OBJExporter.js";

const { countries } = defineProps<{ countries: Set<CountryData> }>();

const backgroundColor = "rgb(255,214,167)";

let missingShapes: string[] = [];

function exportGeometry(geometry: ShapeGeometry) {
  const mesh = new Mesh(geometry);
  const obj = new OBJExporter().parse(mesh);
  console.debug(obj);
}

function getShapeOfCountry(countryName: string) {
  if (!countryName) {
    console.error("No country name provided, can't create shape");
    return null;
  }

  // first, get the country shape from the geojson data

  // every country is a multi polygon
  // a multipolygon is an array of polygons
  const country = (countryGeodata as FeatureCollection).features.find(
    (c) => c.properties!.name == countryName,
  );

  if (!country) {
    missingShapes.push(countryName);
    return null;
  }

  // areas of the country
  // good test: Canada
  let areas = [];
  switch (country.geometry.type) {
    case "MultiPolygon":
      areas = country.geometry.coordinates;
      break;
    case "Polygon":
      areas = [country.geometry.coordinates];
      break;
    default:
      console.error(
        `Country ${countryName} has unsupported geometry type ${country.geometry.type}`,
      );
      return null;
  }

  const geometries = [];

  for (const area of areas) {
    // area consists of outline [0] and holes (every ring after that)
    // good test for holes: South Africa

    // construct shapes for the country in coordinate space

    const shape = new Shape(area.flat().map((c) => new Vector2(...c)));

    // map shape to sphere

    const geometry = new ShapeGeometry(shape);
    const vertices = geometry.getAttribute("position") as BufferAttribute;
    for (let i = 0; i < vertices.count; i++) {
      const x = vertices.getX(i);
      const y = vertices.getY(i);
      const earthCoordinate = positionAtCoordinate(y, x);

      vertices.setX(i, earthCoordinate.x);
      vertices.setY(i, earthCoordinate.y);
      vertices.setZ(i, earthCoordinate.z);
    }
    vertices.needsUpdate = true;
    geometry.computeVertexNormals();

    geometries.push(geometry);
  }

  return geometries;
}

// for debugging
const countryArray = countryCodes
  .all()
  .filter((c) =>
    ["Russia", "Canada", "South Africa"].includes(c.countryNameEn),
  );
//const countryArray = Array.from(countries);
//const countryArray = countryCodes.all();

const countryGeometries = countryArray
  .map((c) => c!.countryNameEn.replace(/\(.*\)/, "").trim())
  .map((name) => ({
    name,
    geometry: getShapeOfCountry(name) ?? [new SphereGeometry(0)],
  }));

exportGeometry(countryGeometries[0].geometry[0]);

if (missingShapes.length > 0) {
  console.error(
    `Could not find shapes for ${missingShapes.length} countries:
    ${missingShapes.join(", ")}`,
  );
}

const material = new MeshBasicMaterial({
  color: backgroundColor,
  side: DoubleSide,
});
</script>

<template>
  <TresGroup
    v-for="[i, country] in countryGeometries.entries()"
    :key="`${country.name}`"
  >
    <TresMesh
      :args="[geometry, material]"
      v-for="[i, geometry] in country.geometry.entries()"
      :key="`${country.name}-${i}`"
    />
  </TresGroup>
</template>
