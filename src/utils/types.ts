export interface JourneyType {
  name: {
    de: string;
  };
  icon: string;
}

// sync with content/config/blogCollection.type (value are keys of this object)
export const journeyTypes: { [i: string]: JourneyType } = {
  bike: {
    name: {
      de: "Fahrrad",
    },
    icon: "mdi:bike",
  },
  hiking: {
    name: {
      de: "Wandern",
    },
    icon: "mdi:hiking",
  },
  roadtrip: {
    name: {
      de: "Roadtrip",
    },
    icon: "mdi:car",
  },
};

export interface Journey {
  location: [number, number];
}
