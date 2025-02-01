import { createUnplugin } from "unplugin";
import { defaultPattern } from "../shared";
import { transformSinglePinia } from "./core";
import type { Options } from "../types";

const unplugin = createUnplugin<Options>((options) => ({
    name: "single-pinia",
    enforce: "pre",
    transformInclude(id) {
        const {
            pattern = defaultPattern
        } = options ?? {};
        return pattern.test(id);
    },
    transform: transformSinglePinia
}));

export default unplugin;