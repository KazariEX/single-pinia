import { defineConfig } from "tsup";

export default defineConfig({
    entry: [
        "./src/ts-macro/index.ts",
        "./src/unplugin/index.ts"
    ],
    format: [
        "cjs",
        "esm"
    ],
    clean: true,
    dts: true,
    shims: true
});