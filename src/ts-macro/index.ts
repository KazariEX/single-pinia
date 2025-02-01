import { type Code, createPlugin } from "ts-macro";
import type { Mapping } from "@volar/language-core";
import { defaultPattern } from "../shared";
import { generateCodes } from "./generateCodes";
import { parseInfo } from "./parseInfo";
import type { Options } from "../types";

export default createPlugin(({ ts }, options?: Options) => {
    return {
        name: "setup-pinia",
        resolveVirtualCode(virtualCode) {
            const {
                pattern = defaultPattern
            } = options ?? {};

            const { ast, filePath } = virtualCode;
            if (!pattern.test(filePath)) {
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