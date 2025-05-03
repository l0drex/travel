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
