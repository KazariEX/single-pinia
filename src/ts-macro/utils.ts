import type ts from "typescript";
import type { TextRange } from "./types";

export const newLine = "\n";
export const endOfLine = ";\n";

export function getStartEnd(
    ts: typeof import("typescript"),
    node: ts.Node,
    ast: ts.SourceFile
): TextRange {
    return {
        start: (ts as any).getTokenPosOfNode(node, ast) as number,
        end: node.end
    };
}

export function getNodeText(
    ts: typeof import("typescript"),
    node: ts.Node,
    ast: ts.SourceFile
) {
    const { start, end } = getStartEnd(ts, node, ast);
    return ast.text.slice(start, end);
}

export function collectVars(
    ts: typeof import("typescript"),
    node: ts.Node,
    ast: ts.SourceFile
) {
    return collectIdentifiers(ts, node, []).map((id) => getNodeText(ts, id, ast));
}

export function collectIdentifiers(
    ts: typeof import("typescript"),
    node: ts.Node,
    result: ts.Identifier[]
) {
    if (ts.isIdentifier(node)) {
        result.push(node);
    }
    else if (ts.isObjectBindingPattern(node)) {
        for (const el of node.elements) {
            collectIdentifiers(ts, el.name, result);
        }
    }
    else if (ts.isArrayBindingPattern(node)) {
        for (const el of node.elements) {
            if (ts.isBindingElement(el)) {
                collectIdentifiers(ts, el.name, result);
            }
        }
    }
    else {
        ts.forEachChild(node, (node) => collectIdentifiers(ts, node, result));
    }
    return result;
}