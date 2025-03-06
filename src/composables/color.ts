import {computed, type ComputedRef, onMounted, ref} from "vue";
import Color from "colorjs.io";

export function getColorProperty(name: string) {
    const color = ref(new Color("#f0f"));

    onMounted(() => {
        const style = getComputedStyle(document.documentElement);
        const prop = style.getPropertyValue(`--color-${name}`);
        
        if (prop == "") {
            console.error("Color must not be empty");
            return;
        }
        
        color.value = new Color(prop).to("srgb");
    });

    return color;
}

export function getColorPropertyString(name: string): ComputedRef<string> {
    const color = getColorProperty(name);

    return computed(() => color.value.toString());
}

export function getColorPropertyArray(name: string) {
    const color = getColorProperty(name);

    return computed(() => {
        console.debug("Color changed");
        
        let c = color.value.toJSON();
        const colors = c.coords;
        colors.push(1);

        return colors;
    });
}
