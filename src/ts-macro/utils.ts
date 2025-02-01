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

export function* collectVars(
    ts: typeof import("typescript"),
    node: ts.Node,
    ast: ts.SourceFile
): Generator<string> {
    for (const id of collectIdentifiers(ts, node)) {
        yield getNodeText(ts, id, ast);
    }
}

export function* collectIdentifiers(
    ts: typeof import("typescript"),
    node: ts.Node
): Generator<ts.Node> {
    if (ts.isIdentifier(node)) {
        yield node;
    }
    else if (ts.isObjectBindingPattern(node)) {
        for (const el of node.elements) {
            collectIdentifiers(ts, el.name);
        }
    }
    else if (ts.isArrayBindingPattern(node)) {
        for (const el of node.elements) {
            if (ts.isBindingElement(el)) {
                collectIdentifiers(ts, el.name);
            }
        }
    }
    else {
        ts.forEachChild(node, (node) => collectIdentifiers(ts, node));
    }
}