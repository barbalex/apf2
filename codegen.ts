import type { CodegenConfig } from '@graphql-codegen/cli'
import { readdirSync } from 'node:fs'

// explicit file list instead of a glob: codegen's glob handling trips over
// this repo's size/pattern and falls back to parsing the raw pattern
const sourceFiles: string[] = []
;(function walk(dir: string) {
  for (const entry of readdirSync(`src/${dir}`, { withFileTypes: true })) {
    const rel = dir ? `${dir}/${entry.name}` : entry.name
    if (entry.isDirectory()) {
      if (rel === 'gql') continue
      walk(rel)
    } else if (/\.(ts|tsx)$/.test(entry.name)) {
      sourceFiles.push(`src/${rel}`)
    }
  }
})('')

const config: CodegenConfig = {
  schema: 'graphql/schema.graphql',
  documents: sourceFiles,
  config: {
    scalars: {
      UUID: { input: 'string', output: 'string' },
      Datetime: { input: 'string', output: 'string' },
      Date: { input: 'string', output: 'string' },
      BigInt: { input: 'number', output: 'number' },
      BigFloat: { input: 'number', output: 'number' },
      Cursor: { input: 'string', output: 'string' },
      JSON: { input: 'unknown', output: 'unknown' },
      GeoJSON: { input: 'unknown', output: 'unknown' },
      JwtToken: { input: 'string', output: 'string' },
    },
  },
  generates: {
    'src/gql/': {
      preset: 'client',
      presetConfig: {
        documentMode: 'documentNode',
        gqlTagName: 'graphql',
        fragmentMasking: false,
      },
      plugins: [],
    },
  },
  ignoreNoDocuments: true,
}

export default config
