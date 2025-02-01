import { camelize, capitalize } from "@vue/shared";
import { allCodeFeatures, type Code } from "ts-macro";
import type { Mapping } from "@volar/language-core";
import type ts from "typescript";
import { endOfLine, newLine } from "./utils";
import type { ParsedInfo } from "./parseInfo";

export interface GenerateCodesOptions extends ParsedInfo {
    ts: typeof ts;
    ast: ts.SourceFile;
    getGeneratedLength: () => number;
    linkedCodeMappings: Mapping[];
}

export function* generateCodes(options: GenerateCodesOptions): Generator<Code> {
    const { ast, defineStore, exportNames, exportNodes } = options;
    if (!defineStore || !defineStore.arg0) {
        return;
    }

    yield [
        ast.text.slice(0, defineStore.statement.start),
        void 0,
        0,
        allCodeFeatures
    ];

    yield `export const use`;
    yield capitalize(camelize(
        ast.text.slice(defineStore.arg0.start + 1, defineStore.arg0.end - 1)
    ));
    yield `Store = `;
    yield [
        ast.text.slice(defineStore.statement.start, defineStore.arg0.end),
        void 0,
        defineStore.statement.start,
        allCodeFeatures
    ];
    yield `, (helper) => {`;

    let start = defineStore.statement.end;
    for (const range of exportNodes) {
        yield [
            ast.text.slice(start, range.start),
            void 0,
            start,
            allCodeFeatures
        ];
        start = range.start + `export`.length;
    }
    yield [
        ast.text.slice(start, ast.text.length),
        void 0,
        start,
        allCodeFeatures
    ];

    yield newLine;
    yield `return {${newLine}`;
    for (const name of exportNames) {
        const sourceOffset = options.getGeneratedLength();
        yield `${name}: `;

        const generatedOffset = options.getGeneratedLength();
        yield `${name},${newLine}`;

        options.linkedCodeMappings.push({
            sourceOffsets: [sourceOffset],
            generatedOffsets: [generatedOffset],
            lengths: [name.length],
            data: void 0
        });
    }
    yield `}${endOfLine}`;
    yield `}`;

    if (defineStore.arg1) {
        yield [
            ast.text.slice(defineStore.arg0.end, defineStore.arg1.end),
            void 0,
            defineStore.arg0.end,
            allCodeFeatures
        ];
    }

    const setupEnd = defineStore.arg1?.end ?? defineStore.arg0.end;
    yield [
        ast.text.slice(setupEnd, defineStore.statement.end),
        void 0,
        setupEnd,
        allCodeFeatures
    ];
}