import { readFileSync, readdirSync } from 'node:fs'
import { describe, it, expect } from 'vitest'
import ts from 'typescript'

import { camelToSnake } from './camelToSnake.ts'

// gqlFilterTypes.ts is hand-maintained since the GraphQL era (5k+ lines).
// tsc validates it against the atoms that USE it, but nothing validates it
// against the database it describes. These tests close that gap:
//
// 1. every scalar filter field must map to a real column of its table
//    (kanel's src/models/apflora/*.ts is generated from the live schema)
//    or be a documented virtual field
// 2. the operators the filter atoms emit must exist both in the scalar
//    filter types AND in apflora.compile_filter's supported-operator list
//    (parsed from the SQL's own error message, so it stays current)
//
// Known drift is pinned below as a ratchet: new drift fails the test, and
// so does forgetting to remove an entry here after the drift is cleaned up.

const filterTypesSource = readFileSync(
  new URL('./gqlFilterTypes.ts', import.meta.url),
  'utf8',
)

// fields computed in SQL, not physical columns:
// - label/labelEk/labelEkf: apflora.<table>_label(row) (see compileFilter.sql)
// - lv95X/lv95Y/wgs84Lat/wgs84Long: projected coordinates of geomPoint
// - apName/popNr: flattened parent fields
const virtualFields = new Set([
  'label',
  'labelEk',
  'labelEkf',
  'lv95X',
  'lv95Y',
  'wgs84Lat',
  'wgs84Long',
  'apName',
  'popNr',
])

// KNOWN DRIFT (2026-11): the four V*LastCount* views pivoted their counts
// into a `jahre` jsonb, but their Filter types still list every former
// zaehl column (triebeTotal, keimlinge, …) — 106 fields that no longer
// exist as columns. Filtering by them cannot work server-side. Cleanup:
// delete the stale members, tsc will surface any real usage.
const knownDrift = [
  'VPopLastCountFilter.andereZaehleinheit',
  'VPopLastCountFilter.artIstVorhanden',
  'VPopLastCountFilter.blatter',
  'VPopLastCountFilter.bluten',
  'VPopLastCountFilter.blutenstande',
  'VPopLastCountFilter.davonBluhendePflanzen',
  'VPopLastCountFilter.davonBluhendeTriebe',
  'VPopLastCountFilter.davonRosetten',
  'VPopLastCountFilter.deckung',
  'VPopLastCountFilter.fertilePflanzen',
  'VPopLastCountFilter.flacheM2',
  'VPopLastCountFilter.fruchtendeTriebe',
  'VPopLastCountFilter.fruchtstande',
  'VPopLastCountFilter.gruppen',
  'VPopLastCountFilter.jungpflanzen',
  'VPopLastCountFilter.keimlinge',
  'VPopLastCountFilter.pflanzen5M2',
  'VPopLastCountFilter.pflanzenOhneJungpflanzen',
  'VPopLastCountFilter.pflanzenTotal',
  'VPopLastCountFilter.pflanzstellen',
  'VPopLastCountFilter.stellen',
  'VPopLastCountFilter.triebe50M2',
  'VPopLastCountFilter.triebeBeweidung',
  'VPopLastCountFilter.triebeIn30M2',
  'VPopLastCountFilter.triebeMahflache',
  'VPopLastCountFilter.triebeTotal',
  'VPopLastCountWithMassnFilter.andereZaehleinheit',
  'VPopLastCountWithMassnFilter.artIstVorhanden',
  'VPopLastCountWithMassnFilter.blatter',
  'VPopLastCountWithMassnFilter.bluten',
  'VPopLastCountWithMassnFilter.blutenstande',
  'VPopLastCountWithMassnFilter.davonBluhendePflanzen',
  'VPopLastCountWithMassnFilter.davonBluhendeTriebe',
  'VPopLastCountWithMassnFilter.davonRosetten',
  'VPopLastCountWithMassnFilter.deckung',
  'VPopLastCountWithMassnFilter.deckungXFlache',
  'VPopLastCountWithMassnFilter.fertilePflanzen',
  'VPopLastCountWithMassnFilter.flacheM2',
  'VPopLastCountWithMassnFilter.fruchtendeTriebe',
  'VPopLastCountWithMassnFilter.fruchtstande',
  'VPopLastCountWithMassnFilter.gruppen',
  'VPopLastCountWithMassnFilter.jungpflanzen',
  'VPopLastCountWithMassnFilter.keimlinge',
  'VPopLastCountWithMassnFilter.pflanzen5M2',
  'VPopLastCountWithMassnFilter.pflanzenOhneJungpflanzen',
  'VPopLastCountWithMassnFilter.pflanzenTotal',
  'VPopLastCountWithMassnFilter.pflanzstellen',
  'VPopLastCountWithMassnFilter.stellen',
  'VPopLastCountWithMassnFilter.triebe50M2',
  'VPopLastCountWithMassnFilter.triebeBeweidung',
  'VPopLastCountWithMassnFilter.triebeIn30M2',
  'VPopLastCountWithMassnFilter.triebeMahflache',
  'VPopLastCountWithMassnFilter.triebeTotal',
  'VTpopLastCountFilter.andereZaehleinheit',
  'VTpopLastCountFilter.artIstVorhanden',
  'VTpopLastCountFilter.blatter',
  'VTpopLastCountFilter.bluten',
  'VTpopLastCountFilter.blutenstande',
  'VTpopLastCountFilter.davonBluhendePflanzen',
  'VTpopLastCountFilter.davonBluhendeTriebe',
  'VTpopLastCountFilter.davonRosetten',
  'VTpopLastCountFilter.deckung',
  'VTpopLastCountFilter.fertilePflanzen',
  'VTpopLastCountFilter.flacheM2',
  'VTpopLastCountFilter.fruchtendeTriebe',
  'VTpopLastCountFilter.fruchtstande',
  'VTpopLastCountFilter.gruppen',
  'VTpopLastCountFilter.jungpflanzen',
  'VTpopLastCountFilter.keimlinge',
  'VTpopLastCountFilter.pflanzen5M2',
  'VTpopLastCountFilter.pflanzenOhneJungpflanzen',
  'VTpopLastCountFilter.pflanzenTotal',
  'VTpopLastCountFilter.pflanzstellen',
  'VTpopLastCountFilter.stellen',
  'VTpopLastCountFilter.triebe50M2',
  'VTpopLastCountFilter.triebeBeweidung',
  'VTpopLastCountFilter.triebeIn30M2',
  'VTpopLastCountFilter.triebeMahflache',
  'VTpopLastCountFilter.triebeTotal',
  'VTpopLastCountWithMassnFilter.andereZaehleinheit',
  'VTpopLastCountWithMassnFilter.artIstVorhanden',
  'VTpopLastCountWithMassnFilter.blatter',
  'VTpopLastCountWithMassnFilter.bluten',
  'VTpopLastCountWithMassnFilter.blutenstande',
  'VTpopLastCountWithMassnFilter.davonBluhendePflanzen',
  'VTpopLastCountWithMassnFilter.davonBluhendeTriebe',
  'VTpopLastCountWithMassnFilter.davonRosetten',
  'VTpopLastCountWithMassnFilter.deckung',
  'VTpopLastCountWithMassnFilter.deckungXFlache',
  'VTpopLastCountWithMassnFilter.fertilePflanzen',
  'VTpopLastCountWithMassnFilter.flacheM2',
  'VTpopLastCountWithMassnFilter.fruchtendeTriebe',
  'VTpopLastCountWithMassnFilter.fruchtstande',
  'VTpopLastCountWithMassnFilter.gruppen',
  'VTpopLastCountWithMassnFilter.jungpflanzen',
  'VTpopLastCountWithMassnFilter.keimlinge',
  'VTpopLastCountWithMassnFilter.pflanzen5M2',
  'VTpopLastCountWithMassnFilter.pflanzenOhneJungpflanzen',
  'VTpopLastCountWithMassnFilter.pflanzenTotal',
  'VTpopLastCountWithMassnFilter.pflanzstellen',
  'VTpopLastCountWithMassnFilter.stellen',
  'VTpopLastCountWithMassnFilter.triebe50M2',
  'VTpopLastCountWithMassnFilter.triebeBeweidung',
  'VTpopLastCountWithMassnFilter.triebeIn30M2',
  'VTpopLastCountWithMassnFilter.triebeMahflache',
  'VTpopLastCountWithMassnFilter.triebeTotal',
]

// scalar filter types (as opposed to relation filters like
// AdresseToManyApFilter and structural fields like and/or/not/*Exist)
const scalarFilterTypes = new Set([
  'StringFilter',
  'IntFilter',
  'FloatFilter',
  'BooleanFilter',
  'DatetimeFilter',
  'UuidFilter',
  'BigIntFilter',
  'BigDecimalFilter',
  'DateFilter',
  'RealFilter',
  'DoublePrecisionFilter',
  'JsonbFilter',
  'LongFilter',
])

type Members = Map<string, string>

const parseTypeMembers = (source: string): Map<string, Members> => {
  const sourceFile = ts.createSourceFile(
    'gqlFilterTypes.ts',
    source,
    ts.ScriptTarget.Latest,
  )
  const types = new Map<string, Members>()
  sourceFile.forEachChild((node) => {
    if (ts.isTypeAliasDeclaration(node)) {
      const members: Members = new Map()
      const literal = node.type
      if (ts.isTypeLiteralNode(literal)) {
        for (const member of literal.members) {
          if (ts.isPropertySignature(member) && member.name && member.type) {
            members.set(
              member.name.getText(sourceFile),
              member.type.getText(sourceFile).replace(/\s+/g, ' '),
            )
          }
        }
      }
      types.set(node.name.text, members)
    }
  })
  return types
}

const filterTypes = parseTypeMembers(filterTypesSource)

// table name (model file without extension) -> column names
const parseModelColumns = (): Map<string, Set<string>> => {
  const modelsDir = new URL('../models/apflora/', import.meta.url)
  const tables = new Map<string, Set<string>>()
  for (const file of readdirSync(modelsDir)) {
    if (!file.endsWith('.ts')) continue
    const source = readFileSync(new URL(file, modelsDir), 'utf8')
    const sourceFile = ts.createSourceFile(file, source, ts.ScriptTarget.Latest)
    const tableName = file.replace(/\.ts$/, '')
    sourceFile.forEachChild((node) => {
      // the main interface carries the table's name
      if (ts.isInterfaceDeclaration(node) && node.name.text === tableName) {
        const columns = new Set<string>()
        for (const member of node.members) {
          if (ts.isPropertySignature(member) && member.name) {
            columns.add(member.name.getText(sourceFile))
          }
        }
        tables.set(tableName, columns)
      }
    })
  }
  return tables
}

const modelColumns = parseModelColumns()

const isScalarFilterMember = (type: string) =>
  [...scalarFilterTypes].some((s) => type === s || type.startsWith(`${s} |`))

const collectDrift = (): string[] => {
  const stale: string[] = []
  for (const [tableName, columns] of modelColumns) {
    const filterName = `${tableName}Filter`
    const members = filterTypes.get(filterName)
    if (!members) continue

    for (const [field, type] of members) {
      if (!isScalarFilterMember(type)) continue
      if (virtualFields.has(field)) continue

      if (!columns.has(camelToSnake(field))) {
        stale.push(`${filterName}.${field}`)
      }
    }
  }
  return stale.sort()
}

describe('gqlFilterTypes contract', () => {
  it('every scalar filter field maps to a real column of its table', () => {
    const drift = collectDrift()
    const known = [...knownDrift].sort()

    // two-way ratchet: new drift fails, and so does stale knowledge
    expect(
      drift.filter((d) => !known.includes(d)),
      'NEW drift',
    ).toEqual([])
    expect(
      known.filter((k) => !drift.includes(k)),
      'already-clean drift still listed in knownDrift',
    ).toEqual([])
  })

  it('the operators the filter atoms emit exist in the scalar types AND in compile_filter', () => {
    // the expression set emitted by the tree*GqlFilterAtom atoms
    // (pinned in src/store/gqlFilter.test.ts)
    const emittedOperators: Record<string, string[]> = {
      StringFilter: ['includes', 'includesInsensitive'],
      IntFilter: ['equalTo', 'in'],
      FloatFilter: ['equalTo'],
      DatetimeFilter: ['equalTo'],
      UuidFilter: ['equalTo', 'in'],
    }

    for (const [scalar, operators] of Object.entries(emittedOperators)) {
      const members = filterTypes.get(scalar)
      expect(members, `${scalar} exists in gqlFilterTypes`).toBeDefined()
      for (const operator of operators) {
        expect(members?.has(operator), `${scalar}.${operator} exists`).toBe(
          true,
        )
      }
    }

    // compile_filter.sql lists its supported operators in the error message
    // of the unsupported-operator branches. The label branch supports fewer
    // operators than the general one — use the general list (the one that
    // also covers coveredBy)
    const sql = readFileSync(
      new URL('../../sql/postgrest/compileFilter.sql', import.meta.url),
      'utf8',
    )
    const supported =
      sql
        .match(/supported: ([a-zA-Z, ]+)/g)
        ?.map((m) => m.replace('supported: ', ''))
        .find((list) => list.includes('coveredBy'))
        ?.split(',')
        .map((o) => o.trim()) ?? []

    expect(
      supported.length,
      'parsed compile_filter operator list',
    ).toBeGreaterThan(0)

    for (const operator of new Set(Object.values(emittedOperators).flat())) {
      expect(
        supported.includes(operator),
        `compile_filter supports ${operator} (supported: ${supported.join(', ')})`,
      ).toBe(true)
    }
  })
})
