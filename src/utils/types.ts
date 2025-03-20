export interface JourneyType {
  id: string;
  name: {
    de: string;
  };
  icon: string;
}

// sync with content/config/blogCollection.type (value are keys of this object)
export const journeyTypes: { [i: string]: JourneyType } = {
  bike: {
    id: "bike",
    name: {
      de: "Fahrrad",
    },
    icon: "mdi:bike",
  },
  hiking: {
    id: "hiking",
    name: {
      de: "Wandern",
    },
    icon: "mdi:hiking",
  },
  roadtrip: {
    id: "roadtrip",
    name: {
      de: "Roadtrip",
    },
    icon: "mdi:car",
  },
};

export interface Journey {
  location: [number, number];
}
