export default defineNuxtConfig({
    app: {
        head: {
            title: "Single Pinia Playground"
        }
    },
    css: [
        "~/assets/style.css"
    ],
    compatibilityDate: "2024-07-19",
    devtools: {
        enabled: true
    },
    future: {
        compatibilityVersion: 4
    },
    ssr: false,
    modules: [
        "@pinia/nuxt",
        "@unocss/nuxt",
        "@vueuse/nuxt",
        "../src/unplugin/nuxt.ts"
    ]
});