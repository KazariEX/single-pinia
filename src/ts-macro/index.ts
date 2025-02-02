import picomatch from "picomatch";
import { type Code, createPlugin } from "ts-macro";
import type { Mapping } from "@volar/language-core";
import { defaultIncludes } from "../shared";
import { generateCodes } from "./generateCodes";
import { parseInfo } from "./parseInfo";
import type { Options } from "../types";

export default createPlugin(({ ts }, options?: Options) => {
    const {
        includes = defaultIncludes
    } = options ?? {};

    const filter = picomatch(includes, {
        contains: true
    });

    return {
        name: "single-pinia",
        resolveVirtualCode(virtualCode) {
            const { ast, filePath } = virtualCode;
            if (!filter(filePath)) {
                return;
            }

            const info = parseInfo(ts, ast);

            let generatedLength = "/* placeholder */\n\n".length;
            const codes: Code[] = [];
            const linkedCodeMappings: Mapping[] = [];
            const codegen = generateCodes({
                ...info,
                ts,
                ast,
                filePath,
                getGeneratedLength: () => generatedLength,
                linkedCodeMappings
            });

            let current = codegen.next();
            while (!current.done) {
                const code = current.value;
                codes.push(code);
                generatedLength += typeof code === "string"
                    ? code.length
                    : code[0].length;
                current = codegen.next();
            }

            if (codes.length) {
                virtualCode.codes = codes;
                (virtualCode as any).linkedCodeMappings = linkedCodeMappings;
            }
        }
    };
});