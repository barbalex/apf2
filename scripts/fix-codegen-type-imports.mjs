// runs after graphql-codegen — keeps the generated gql module usable:
// 1. type-only imports must use `import type` (verbatimModuleSyntax)
// 2. Apollo's gql interpolates DocumentNodes via `arg.loc.source.body`,
//    but the generated ASTs have no loc — patch it (with printed SDL) when
//    a document is handed out, so fragments can be interpolated into
//    dynamic queries
// 3. exact-string lookup stays primary; a whitespace-normalized map is built
//    lazily as fallback so indentation changes can't break lookups
import { readFileSync, writeFileSync } from 'node:fs'

for (const file of ['src/gql/gql.ts', 'src/gql/graphql.ts']) {
  const src = readFileSync(file, 'utf8')
  const out = src.replaceAll(
    "import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';",
    "import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';",
  )
  if (out !== src) writeFileSync(file, out)
}

const gqlFile = 'src/gql/gql.ts'
const src = readFileSync(gqlFile, 'utf8')
const OLD = `export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}`
const NEW = `export function graphql(source: string) {
  const doc = (documents as any)[source] ?? lookupNormalized(source);
  if (doc?.kind === 'Document' && !doc.loc) {
    doc.loc = { source: { body: print(doc), name: 'GraphQL request', locationOffset: { line: 1, column: 1 } } };
  }
  return doc ?? {};
}

function normalizeKey(s: string) {
  return s.split('\\n').map((l) => l.trim()).join('\\n').trim();
}

let normalizedDocuments: Record<string, unknown> | undefined;
function lookupNormalized(source: string) {
  normalizedDocuments ??= Object.fromEntries(
    Object.entries(documents).map(([key, value]) => [normalizeKey(key), value]),
  );
  return (normalizedDocuments as any)[normalizeKey(source)];
}`
if (!src.includes(OLD)) throw new Error('generated graphql() function not found — codegen output format changed?')
// the print import must go to the top: statements between the graphql
// overloads and their implementation are a syntax error (TS2391)
const withImport = "/* eslint-disable */\nimport { print } from 'graphql';\n" + src.slice("/* eslint-disable */\n".length)
writeFileSync(gqlFile, withImport.replace(OLD, NEW))
console.log('patched generated gql module (type imports, loc, lookup fallback)')
