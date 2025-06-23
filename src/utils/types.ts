export enum JourneyTypeId {
  bike = "bike",
  hiking = "hiking",
  roadtrip = "roadtrip",
}

export interface JourneyType {
  name: string;
  icon: string;
}

// sync with content/config/blogCollection.type (value are keys of this object)
export const journeyTypes: Record<JourneyTypeId, JourneyType> = {
  [JourneyTypeId.bike]: {
    name: "Fahrrad",
    icon: "material-symbols:directions-bike-rounded",
  },
  [JourneyTypeId.hiking]: {
    name: "Wandern",
    icon: "material-symbols:hiking-rounded",
  },
  [JourneyTypeId.roadtrip]: {
    name: "Roadtrip",
    icon: "material-symbols:directions-car-rounded",
  },
} as const;

export interface Journey {
  location: [number, number];
}

export interface Stat {
  name: string;
  icon: string;
  value: string;
  unit: string;
}

export enum StatId {
  days = "days",
  totalDistance = "totalDistance",
  kmPerDay = "kmPerDay",
  elevationUp = "elevationUp",
  elevationDown = "elevationDown",
  totalTime = "totalTime",
  timePerDay = "timePerDay",
  averageSpeed = "averageSpeed",
  topSpeed = "topSpeed",
}

export const statsPrototypes: Record<StatId, Stat> = {
  [StatId.days]: {
    name: "Dauer",
    icon: "material-symbols:date-range",
    value: "",
    unit: "Tage",
  },
  [StatId.totalDistance]: {
    name: "Gesamtkilometer",
    icon: "material-symbols:route",
    value: "",
    unit: "km",
  },
  [StatId.kmPerDay]: {
    name: "Tagesstrecke",
    icon: "material-symbols:linear-scale",
    value: "",
    unit: "km",
  },
  [StatId.elevationUp]: {
    name: "Bergauf",
    icon: "material-symbols:trending-up",
    value: "",
    unit: "m",
  },
  [StatId.elevationDown]: {
    name: "Bergab",
    icon: "material-symbols:trending-down",
    value: "",
    unit: "m",
  },
  [StatId.totalTime]: {
    name: "Zeit unterwegs",
    icon: "material-symbols:timer",
    value: "",
    unit: "h",
  },
  [StatId.timePerDay]: {
    name: "Zeit pro Tag",
    icon: "material-symbols:avg-time",
    value: "",
    unit: "h",
  },
  [StatId.averageSpeed]: {
    icon: "material-symbols:speed",
    name: "Ø-Geschwindigkeit",
    value: "",
    unit: "km/h",
  },
  [StatId.topSpeed]: {
    icon: "material-symbols:rocket-launch",
    name: "Höchstgeschwindigkeit",
    value: "",
    unit: "km/h",
  },
};
