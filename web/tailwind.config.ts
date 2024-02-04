import {fontFamily} from "tailwindcss/defaultTheme";
/** @type {import('tailwindcss').Config} */
export const content = [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
];
export const theme = {
    fontFamily: {
        sans: ['"Segoe UI"', "Roboto", "sans-serif", ...fontFamily.sans]
    },
    extend: {
        colors: {
            primary: "#e31616",
            secondary: "#475e53",
            accent: {
                neutral: "#81959f",
                vivid: "#7c3aed"
            },
            background: "#0d0d10",
            text: "#f0ebeb"
        },
        backgroundImage: {
            "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
            "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))"
        }
    }
};
export const plugins = [];
