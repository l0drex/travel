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
    icon: "material-symbols:directions-bike-rounded",
  },
  hiking: {
    id: "hiking",
    name: {
      de: "Wandern",
    },
    icon: "material-symbols:hiking-rounded",
  },
  roadtrip: {
    id: "roadtrip",
    name: {
      de: "Roadtrip",
    },
    icon: "material-symbols:directions-car-rounded",
  },
};

export interface Journey {
  location: [number, number];
}
