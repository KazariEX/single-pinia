import { addVitePlugin, addWebpackPlugin, createIsIgnored, createResolver, defineNuxtModule } from "@nuxt/kit";
import { camelize, capitalize } from "@vue/shared";
import { basename } from "pathe";
import { type Import, normalizeScanDirs, type ScanDirExportsOptions, scanFilesFromDir } from "unimport";
import vite from "./vite";
import webpack from "./webpack";
import type { Options } from "../types";

export interface ModuleOptions extends Options {}

export default defineNuxtModule<ModuleOptions>({
    meta: {
        name: "nuxt-single-pinia",
        configKey: "singlePinia"
    },
    setup(options, nuxt) {
        const { resolve } = createResolver(import.meta.url);

        addVitePlugin(() => vite(options));
        addWebpackPlugin(() => webpack(options));

        let storesDirs = [resolve(nuxt.options.srcDir, "stores")];
        if ("pinia" in nuxt.options) {
            storesDirs = (
                ((nuxt.options.pinia ?? {}) as import("@pinia/nuxt").ModuleOptions).storesDirs ??= storesDirs
            ).map((dir) => resolve(nuxt.options.rootDir, dir));
        }

        const isIgnored = createIsIgnored(nuxt);
        nuxt.hook("imports:extend", async (imports) => {
            const options: ScanDirExportsOptions = {
                fileFilter: (file) => !isIgnored(file)
            };
            const normalizedDirs = normalizeScanDirs(storesDirs, options);
            const files = await scanFilesFromDir(normalizedDirs, options);

            for (let i = 0; i < imports.length; i++) {
                const item = imports[i];
                if (files.includes(item.from)) {
                    imports.splice(i, 1);
                    i--;
                }
            }

            const scannedImports = files.map<Import>((file) => {
                const name = basename(file).split(".")[0];
                return {
                    from: file,
                    name: `use${capitalize(camelize(name))}Store`
                };
            });

            imports.push(...scannedImports);
        });
    }
});