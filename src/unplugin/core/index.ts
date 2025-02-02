import { camelize, capitalize } from "@vue/shared";
import { babelParse, getLang, walkAST } from "ast-kit";
import { generateTransform, MagicStringAST } from "magic-string-ast";
import type t from "@babel/types";
import { basename } from "pathe";

export function transformSinglePinia(code: string, id: string) {
    const lang = getLang(id);
    const program = babelParse(code, lang);

    const s = new MagicStringAST(code);
    const exportNames: string[] = [];

    let defined = false;
    const name = basename(id).split(".")[0];

    for (const node of program.body) {
        if (
            node.type === "ExpressionStatement"
            && node.expression.type === "CallExpression"
            && node.expression.callee.type === "Identifier"
            && node.expression.callee.name === "defineStore"
        ) {
            defined = true;
            const [arg0] = node.expression.arguments;

            let arg0End = 0;
            if (arg0?.type === "StringLiteral") {
                arg0End = arg0.end!;
            }

            s.appendLeft(node.start!, `export const use${
                capitalize(camelize(name))
            }Store = `);

            s.prependLeft(arg0End, `, (helper) => {`);

            s.move(node.end!, code.length, arg0End);
        }
        else if (
            defined
            && node.type === "ExportNamedDeclaration"
            && node.declaration
        ) {
            const decl = node.declaration;
            if (decl.type === "VariableDeclaration") {
                const decls = decl.declarations;
                for (const decl of decls) {
                    exportNames.push(...collectVars(decl.id, []));
                }
            }
            else if (decl.type === "FunctionDeclaration") {
                exportNames.push(decl.id!.name);
            }
            s.remove(node.start!, decl.start!);
        }
    }

    s.appendLeft(code.length, "\nreturn { ");
    for (const name of exportNames) {
        s.appendLeft(code.length, `${name}, `);
    }
    s.appendLeft(code.length, "};\n}");

    return generateTransform(s, id);
}

function collectVars(
    id: t.Node,
    result: string[]
) {
    if (id.type === "Identifier") {
        result.push(id.name);
    }
    else if (id.type === "ObjectPattern") {
        for (const prop of id.properties) {
            if (prop.type === "RestElement") {
                collectVars(prop.argument, result);
            }
            else {
                collectVars(prop.value, result);
            }
        }
    }
    else if (id.type === "ArrayPattern") {
        for (const elem of id.elements) {
            if (elem) {
                collectVars(elem, result);
            }
        }
    }
    else {
        walkAST(id, {
            enter(node) {
                collectVars(node, result);
            }
        });
    }
    return result;
}