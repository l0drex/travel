import {ref, type Ref} from "vue";

/**
 * Returns the text of the title currently referenced in the URL.
 * A title is referenced in the url for example if the user clicked on it in the toc.
 */
export function useUrlTitle(): Ref<string | null, string | null> {
    const title = ref<string | null>(null);

    function update() {
        const hash = decodeURIComponent(location.hash).replace("#", "");
        if (hash === "") {
            return;
        }
        
        const t = document.getElementById(hash)?.innerText;

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
