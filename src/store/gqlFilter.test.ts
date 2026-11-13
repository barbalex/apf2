import { describe, it, expect, beforeEach } from 'vitest'
import type { PrimitiveAtom } from 'jotai'

import {
  store,
  treeActiveNodeArrayAtom,
  treeApFilterAtom,
  treeApGqlFilterAtom,
  treeApGqlFilterForTreeAtom,
  treeDataFilterAtom,
  treeDataFilterEmptyAtom,
  treeEmptyNodeLabelFilterAtom,
  treeMapFilterAtom,
  treeNodeLabelFilterAtom,
  treePopGqlFilterAtom,
  treeTpopGqlFilterAtom,
} from './index.ts'
import type { TreeNodeLabelFilter } from './index.ts'
import { initial as initialApTab } from './DataFilter/ap.ts'
import { initial as initialPopTab } from './DataFilter/pop.ts'
import { initial as initialTpopTab } from './DataFilter/tpop.ts'

// the atoms read here emit the jsonb filter trees that apflora.compile_filter
// (sql/postgrest/compileFilter.sql) consumes server-side. These tests pin the
// contract: hierarchy composition, the all/filtered split, expression choice
// per field type and the empty-"oder"-tab removal.
const projId = crypto.randomUUID()
const apId = crypto.randomUUID()

// the app writes the drawn geometry the same way (Karte/DrawControl.tsx)
const mapFilterAtom = treeMapFilterAtom as unknown as PrimitiveAtom<
  string | undefined
>
const mapFilterWkt =
  'SRID=2056;POLYGON((2685000 1246000,2686000 1246000,2686000 1247000,2685000 1247000,2685000 1246000))'

const setDataFilter = (
  partial: Partial<{
    ap: (typeof initialApTab)[]
    pop: (typeof initialPopTab)[]
    tpop: (typeof initialTpopTab)[]
  }>,
) => {
  const dataFilter = store.get(treeDataFilterAtom)
  store.set(treeDataFilterAtom, {
    ...dataFilter,
    ap: partial.ap ?? [initialApTab],
    pop: partial.pop ?? [initialPopTab],
    tpop: partial.tpop ?? [initialTpopTab],
  })
}

const setNodeLabelFilter = (key: keyof TreeNodeLabelFilter, value: string) => {
  store.set(treeNodeLabelFilterAtom, {
    ...store.get(treeNodeLabelFilterAtom),
    [key]: value,
  })
}

// the DataFilter initial tabs are inferred as all-null; the filter atoms
// only read them, so tests can safely widen a field through this helper
const tabWith = <T extends object>(tab: T, values: Record<string, unknown>) =>
  ({ ...tab, ...values }) as unknown as T

beforeEach(() => {
  store.set(treeActiveNodeArrayAtom, [])
  store.set(treeApFilterAtom, false)
  store.set(treeDataFilterEmptyAtom)
  store.set(treeEmptyNodeLabelFilterAtom)
  store.set(mapFilterAtom, undefined)
})

describe('treeApGqlFilterAtom', () => {
  it('builds no filter when nothing is set', () => {
    expect(store.get(treeApGqlFilterAtom)).toEqual({
      all: { or: [] },
      filtered: { or: [] },
    })
  })

  it('restricts to active action plans when "nur AP" is on', () => {
    store.set(treeApFilterAtom, true)

    expect(store.get(treeApGqlFilterAtom)).toEqual({
      all: { or: [] },
      filtered: { or: [{ bearbeitung: { in: [1, 2, 3] } }] },
    })
  })

  it('maps numeric form-filter fields to equalTo', () => {
    setDataFilter({ ap: [tabWith(initialApTab, { startJahr: 2000 })] })

    expect(store.get(treeApGqlFilterAtom).filtered).toEqual({
      or: [{ startJahr: { equalTo: 2000 } }],
    })
  })

  it('maps string form-filter fields to includes', () => {
    setDataFilter({
      ap: [tabWith(initialApTab, { ekfBeobachtungszeitpunkt: '06-04' })],
    })

    expect(store.get(treeApGqlFilterAtom).filtered).toEqual({
      or: [{ ekfBeobachtungszeitpunkt: { includes: '06-04' } }],
    })
  })

  it('combines multiple "oder" tabs into or-branches', () => {
    setDataFilter({
      ap: [
        tabWith(initialApTab, { startJahr: 2000 }),
        tabWith(initialApTab, { umsetzung: 1 }),
      ],
    })

    expect(store.get(treeApGqlFilterAtom).filtered).toEqual({
      or: [{ startJahr: { equalTo: 2000 } }, { umsetzung: { equalTo: 1 } }],
    })
  })

  it('drops an empty last "oder" tab (user added one but typed no criteria)', () => {
    setDataFilter({
      ap: [
        tabWith(initialApTab, { startJahr: 2000 }),
        tabWith(initialApTab, { umsetzung: 1 }),
        initialApTab,
      ],
    })

    expect(store.get(treeApGqlFilterAtom).filtered).toEqual({
      or: [{ startJahr: { equalTo: 2000 } }, { umsetzung: { equalTo: 1 } }],
    })
  })

  it('combines form filter and node label filter in one branch', () => {
    setDataFilter({ ap: [tabWith(initialApTab, { startJahr: 2000 })] })
    setNodeLabelFilter('ap', 'gesch')

    expect(store.get(treeApGqlFilterAtom).filtered).toEqual({
      or: [
        {
          startJahr: { equalTo: 2000 },
          label: { includesInsensitive: 'gesch' },
        },
      ],
    })
  })

  it('turns "nur AP" off when the form filter uses a conflicting field', () => {
    setDataFilter({ ap: [tabWith(initialApTab, { bearbeitung: 4 })] })
    store.set(treeApFilterAtom, true)

    // reading the atom has the documented side effect of switching the
    // conflicting "nur AP" filter off (plus a delayed notification)
    expect(store.get(treeApGqlFilterAtom).filtered).toEqual({
      or: [{ bearbeitung: { equalTo: 4 } }],
    })
    expect(store.get(treeApFilterAtom)).toBe(false)
  })
})

describe('treeApGqlFilterForTreeAtom', () => {
  it('returns a flat or-filter without the all/filtered split', () => {
    setDataFilter({ ap: [tabWith(initialApTab, { startJahr: 2000 })] })
    store.set(treeApFilterAtom, true)
    setNodeLabelFilter('ap', 'gesch')

    expect(store.get(treeApGqlFilterForTreeAtom)).toEqual({
      or: [
        {
          bearbeitung: { in: [1, 2, 3] },
          startJahr: { equalTo: 2000 },
          label: { includesInsensitive: 'gesch' },
        },
      ],
    })
  })
})

describe('treePopGqlFilterAtom', () => {
  it('passes the parent ap filter through apByApId and scopes to the active ap', () => {
    store.set(treeActiveNodeArrayAtom, [
      'Projekte',
      projId,
      'Arten',
      apId,
      'Populationen',
    ])

    expect(store.get(treePopGqlFilterAtom)).toEqual({
      all: {
        apId: { equalTo: apId },
        apByApId: { or: [] },
      },
      filtered: {
        or: [
          {
            apId: { equalTo: apId },
            apByApId: { or: [] },
          },
        ],
      },
    })
  })

  it('nests the parent "filtered" filter into the filtered branches', () => {
    store.set(treeActiveNodeArrayAtom, [
      'Projekte',
      projId,
      'Arten',
      apId,
      'Populationen',
    ])
    store.set(treeApFilterAtom, true)

    expect(store.get(treePopGqlFilterAtom).filtered).toEqual({
      or: [
        {
          apId: { equalTo: apId },
          apByApId: { or: [{ bearbeitung: { in: [1, 2, 3] } }] },
        },
      ],
    })
  })

  it('leaks the parent "filtered" filter into all — known merge-mutation quirk', () => {
    store.set(treeActiveNodeArrayAtom, [
      'Projekte',
      projId,
      'Arten',
      apId,
      'Populationen',
    ])
    store.set(treeApFilterAtom, true)

    // es-toolkit's merge mutates its target: singleFilterForAll is the same
    // object as singleFilterByHierarchy, which the branch loop then merges
    // the parent "filtered" filter into. The ap form filter ("nur AP" here)
    // therefore restricts the "all" count that PopFilter shows as the total.
    // Pinned as-is — changing it changes visible counts (see PopFilter).
    expect(store.get(treePopGqlFilterAtom).all).toEqual({
      apId: { equalTo: apId },
      apByApId: { or: [{ bearbeitung: { in: [1, 2, 3] } }] },
    })
  })

  it('combines parent filter, form filter, label filter and map filter', () => {
    setDataFilter({ pop: [tabWith(initialPopTab, { nr: 5 })] })
    setNodeLabelFilter('pop', 'wald')
    store.set(mapFilterAtom, mapFilterWkt)

    expect(store.get(treePopGqlFilterAtom)).toEqual({
      all: { apByApId: { or: [] } },
      filtered: {
        or: [
          {
            apByApId: { or: [] },
            nr: { equalTo: 5 },
            label: { includesInsensitive: 'wald' },
            geomPoint: { coveredBy: mapFilterWkt },
          },
        ],
      },
    })
  })
})

describe('treeTpopGqlFilterAtom', () => {
  it('defaults to the empty pop filter nested under popByPopId', () => {
    // the branch is not empty: the parent merge puts apByApId and the pop
    // "filtered" or-array into popByPopId (all and filtered share content —
    // see the merge-mutation quirk test in treePopGqlFilterAtom)
    expect(store.get(treeTpopGqlFilterAtom)).toEqual({
      all: {
        popByPopId: {
          apByApId: { or: [] },
          or: [{ apByApId: { or: [] } }],
        },
      },
      filtered: {
        or: [
          {
            popByPopId: {
              apByApId: { or: [] },
              or: [{ apByApId: { or: [] } }],
            },
          },
        ],
      },
    })
  })

  it('composes the whole pop filter (hierarchy, ap and pop criteria) under popByPopId', () => {
    store.set(treeActiveNodeArrayAtom, [
      'Projekte',
      projId,
      'Arten',
      apId,
      'Populationen',
    ])
    setDataFilter({
      pop: [tabWith(initialPopTab, { nr: 5 })],
      tpop: [tabWith(initialTpopTab, { flurname: 'seen' })],
    })

    // the pop criteria (nr: 5) also restrict all — the same merge-mutation
    // quirk as above, one level deeper
    expect(store.get(treeTpopGqlFilterAtom)).toEqual({
      all: {
        popByPopId: {
          apId: { equalTo: apId },
          apByApId: { or: [] },
          or: [
            {
              apId: { equalTo: apId },
              apByApId: { or: [] },
              nr: { equalTo: 5 },
            },
          ],
        },
      },
      filtered: {
        or: [
          {
            popByPopId: {
              apId: { equalTo: apId },
              apByApId: { or: [] },
              or: [
                {
                  apId: { equalTo: apId },
                  apByApId: { or: [] },
                  nr: { equalTo: 5 },
                },
              ],
            },
            flurname: { includes: 'seen' },
          },
        ],
      },
    })
  })
})
