import { createUnplugin } from "unplugin";
import { defaultPattern } from "../shared";
import { transformSetupPinia } from "./core";
import type { Options } from "../types";

const unplugin = createUnplugin<Options>((options) => ({
    name: "setup-pinia",
    enforce: "pre",
    transformInclude(id) {
        const {
            pattern = defaultPattern
        } = options ?? {};
        return pattern.test(id);
    },
    transform: transformSetupPinia
}));

export default unplugin;