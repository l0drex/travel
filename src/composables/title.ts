import {ref, type Ref} from "vue";

/**
 * Returns the text of the title currently referenced in the URL.
 * A title is referenced in the url for example if the user clicked on it in the toc.
 */
export function useUrlTitle(): Ref<string | null, string | null> {
    const title = ref<string | null>(null);

    function update() {
        let t = document.getElementById(decodeURIComponent(location.hash).replace("#", ""))?.innerText;

        if (!t || t == "") {
            title.value = null;
        } else {
            title.value = t;
        }
    }

    update();
    window.addEventListener("hashchange", update);

    return title;
}
