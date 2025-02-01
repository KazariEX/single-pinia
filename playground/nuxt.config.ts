import { fileURLToPath } from "node:url";

export default defineNuxtConfig({
    app: {
        head: {
            title: "Setup Pinia Playground"
        }
    },
    alias: {
        "setup-pinia": fileURLToPath(new URL("../src/unplugin/index.ts", import.meta.url)),
        "setup-pinia/ts-macro": fileURLToPath(new URL("../src/ts-macro/index.ts", import.meta.url))
    },
    css: [
        "~/assets/style.css"
    ],
    compatibilityDate: "2024-07-19",
    devServer: {
        port: 7453
    },
    future: {
        compatibilityVersion: 4
    },
    ssr: false,
    modules: [
        "@pinia/nuxt",
        "@unocss/nuxt",
        "@vueuse/nuxt"
    ]
});