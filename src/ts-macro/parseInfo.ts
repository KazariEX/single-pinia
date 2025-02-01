import type ts from "typescript";
import { collectVars } from "./utils";
import type { TextRange } from "./types";

export interface ParsedInfo {
    defineStore?: DefineStore;
    exportNames: string[];
    exportNodes: TextRange[];
}

interface DefineStore {
    statement: TextRange;
    exp: TextRange;
    arg0?: TextRange;
    arg1?: TextRange;
}

export function parseInfo(
    ts: typeof import("typescript"),
    ast: ts.SourceFile
) {
    const info: ParsedInfo = {
        exportNames: [],
        exportNodes: []
    };

    let defined = false;
    ts.forEachChild(ast, (node) => {
        if (
            ts.isExpressionStatement(node)
            && ts.isCallExpression(node.expression)
            && ts.isIdentifier(node.expression.expression)
            && node.expression.expression.text === "defineStore"
        ) {
            defined = true;
            const defineStore: DefineStore = {
                statement: getStartEnd(node),
                exp: getStartEnd(node.expression)
            };

            const [arg0, arg1] = node.expression.arguments;

            if (arg0 && ts.isStringLiteralLike(arg0)) {
                defineStore.arg0 = getStartEnd(arg0);
            }
            if (arg1 && ts.isObjectLiteralExpression(arg1)) {
                defineStore.arg1 = getStartEnd(arg1);
            }

            info.defineStore = defineStore;
        }
        else if (defined && isExportNode(ts, node)) {
            if (ts.isVariableStatement(node)) {
                for (const decl of node.declarationList.declarations) {
                    info.exportNames.push(...collectVars(ts, decl.name, ast));
                }
                info.exportNodes.push(getStartEnd(node));
            }
            else if (ts.isFunctionDeclaration(node) && node.name) {
                info.exportNames.push(node.name.text);
                info.exportNodes.push(getStartEnd(node));
            }
        }
    });

    return info;

    function getStartEnd(node: ts.Node) {
        return {
            start: node.getStart(ast),
            end: node.getEnd()
        };
    }
}

function isExportNode(ts: typeof import("typescript"), node: ts.Node) {
    return hasModifiers(node)
        && node.modifiers.some((mod) => mod.kind === ts.SyntaxKind.ExportKeyword)
        && node.modifiers.every((mod) => mod.kind !== ts.SyntaxKind.DefaultKeyword);
}

function hasModifiers(node: ts.Node): node is ts.Node & { modifiers: ts.NodeArray<ts.Modifier> } {
    return "modifiers" in node && Array.isArray(node.modifiers);
}