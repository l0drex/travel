export enum JourneyTypeIds {
  bike = "bike",
  hiking = "hiking",
  roadtrip = "roadtrip",
}

export interface JourneyType {
  id: JourneyTypeIds;
  name: {
    de: string;
  };
  icon: string;
}

// sync with content/config/blogCollection.type (value are keys of this object)
export const journeyTypes: { [K in JourneyTypeIds]: JourneyType } = {
  bike: {
    id: JourneyTypeIds.bike,
    name: {
      de: "Fahrrad",
    },
    icon: "material-symbols:directions-bike-rounded",
  },
  hiking: {
    id: JourneyTypeIds.hiking,
    name: {
      de: "Wandern",
    },
    icon: "material-symbols:hiking-rounded",
  },
  roadtrip: {
    id: JourneyTypeIds.roadtrip,
    name: {
      de: "Roadtrip",
    },
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
}

export const statsPrototypes: { [K: string]: Stat } = {
  days: {
    name: "Dauer",
    icon: "material-symbols:date-range",
    value: "{} Tage",
  },
  totalDistance: {
    name: "Gesamtkilometer",
    icon: "material-symbols:route",
    value: "{} km",
  },
  kmPerDay: {
    name: "Kilometer pro Tag",
    icon: "material-symbols:linear-scale",
    value: "{} km",
  },
  elevationUp: {
    name: "Bergauf",
    icon: "material-symbols:trending-up",
    value: "{} m",
  },
  elevationDown: {
    name: "Bergab",
    icon: "material-symbols:trending-down",
    value: "{} m",
  },
  totalTime: {
    name: "Zeit unterwegs",
    icon: "material-symbols:timer",
    value: "{} h",
  },
  averageSpeed: {
    icon: "material-symbols:speed",
    name: "Ø-Geschwindigkeit",
    value: "{} km/h",
  },
  topSpeed: {
    icon: "material-symbols:rocket-launch",
    name: "Höchstgeschwindigkeit",
    value: "{} km/h",
  },
};
