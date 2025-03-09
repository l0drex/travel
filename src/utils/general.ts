import alt from "@assets/alt.json";
import type {CollectionEntry} from "astro:content";

export function dateFormatter(date: Date, locale: Intl.LocalesArgument, short: boolean = false) {
    return date.toLocaleDateString(locale, {
        month: short ? 'short' : 'long',
        year: 'numeric'
    })
}

export function getPreviewAlt(journey: CollectionEntry<"posts">) {
    const id = journey.slug;

    if (id in alt) {
        return alt[id as keyof typeof alt];
    }

    console.warn(`Preview image of journey ${id} has no alt text`);
    return ""
}
