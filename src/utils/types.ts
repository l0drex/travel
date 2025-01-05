export interface JourneyType {
    name: {
        de: string;
    };
    icon: string;
}

// sync with content/config/blogCollection.type (value are keys of this object)
export const journeyTypes: {[i: string]: JourneyType} = {
    bike: {
        name: {
            de: 'Fahrrad'
        },
        icon: 'mdi:bike'
    },
    hiking: {
        name: {
            de: 'Wandern'
        },
        icon: 'mdi:hiking'
    }
}

export interface Journey {
    title: string;
    id: string;
    url: string;
    type: JourneyType;
    date: Date;
    location: [number, number];
    image?: string;
}
