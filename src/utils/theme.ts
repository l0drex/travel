export const colors = {
    light: {
        earth: "rgb(254, 214, 170, 255)",
        bg: "rgb(255, 237, 212, 255)",
    },
    dark: {
        earth: "rgb(27, 24, 22, 255)",
        bg: "rgb(11, 9, 8, 255)",
    },
    accent: "rgb(220, 38, 38)",
    secondary: "rgb(249, 115, 22)"
} as const;

export function colorArray(color: string) {
    if (!color.startsWith("rgb")) {
        throw new Error("Color must be in rgb() format");
    }

    // remove rgb wrapper
    color = color.replace('rgb(', '');
    color = color.replace(')', '');
    
    // to array of numbers
    return color.split(",")
        .map(color => Number(color));
}
