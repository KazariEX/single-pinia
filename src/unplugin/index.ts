import picomatch from "picomatch";
import { createUnplugin } from "unplugin";
import { defaultIncludes } from "../shared";
import { transformSinglePinia } from "./core";
import type { Options } from "../types";

const unplugin = createUnplugin<Options>((options) => {
    const {
        includes = defaultIncludes
    } = options ?? {};

    const filter = picomatch(includes, {
        contains: true
    });

    return {
        name: "single-pinia",
        enforce: "pre",
        transformInclude(id) {
            return filter(id);
        },
        transform: transformSinglePinia
    };
});

export default unplugin;