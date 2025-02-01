import { defineConfig } from "tsup";

export default defineConfig({
    entry: [
        "./src/index.ts",
        "./src/ts-macro/index.ts",
        "./src/unplugin/esbuild.ts",
        "./src/unplugin/nuxt.ts",
        "./src/unplugin/rolldown.ts",
        "./src/unplugin/rollup.ts",
        "./src/unplugin/rspack.ts",
        "./src/unplugin/vite.ts",
        "./src/unplugin/webpack.ts"
    ],
    format: [
        "cjs",
        "esm"
    ],
    clean: true,
    dts: true,
    shims: true
});