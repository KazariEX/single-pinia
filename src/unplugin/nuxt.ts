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

        nuxt.hook("imports:dirs", (dirs) => {
            for (const dir of storesDirs) {
                const idx = dirs.indexOf(dir);
                if (idx !== -1) {
                    dirs.splice(idx, 1);
                }
            }
        });

        const isIgnored = createIsIgnored(nuxt);
        nuxt.hook("imports:extend", async (imports) => {
            const scannedImports = await scanDirExports(storesDirs, {
                fileFilter: (file) => !isIgnored(file)
            });
            imports.push(...scannedImports);
        });
    }
});

async function scanDirExports(dirs: string[], options: ScanDirExportsOptions) {
    const normalizedDirs = normalizeScanDirs(dirs, options);
    const files = await scanFilesFromDir(normalizedDirs, options);

    return files.map<Import>((file) => {
        const name = basename(file).split(".")[0];
        return {
            from: file,
            name: `use${capitalize(camelize(name))}Store`
        };
    });
}