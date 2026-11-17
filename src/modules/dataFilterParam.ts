// the working data filter (treeDataFilterAtom) is kept in the url as a
// single ?f= param: base64url of a sparse json (only non-null values),
// so any filtered view is linkable by copying the url — no saving step.
// Types survive the round trip because the value travels as json
import { initialDataFilterValues } from '../store/initialDataFilterValues.ts'
import { sanitizeDataFilter } from './sanitizeDataFilter.ts'
import { bytesToB64url, b64urlToBytes } from './base64url.ts'

type DataFilter = typeof initialDataFilterValues

export const dataFilterParamName = 'f'

// only values that filter anything; tables and oder-tabs without
// values are dropped. Returns null when nothing is filtered
const buildSparseDataFilter = (
  filter: DataFilter,
): Record<string, Record<string, unknown>[]> | null => {
  const isSet = (value: unknown) =>
    value !== null && value !== undefined && value !== ''
  const sparse: Record<string, Record<string, unknown>[]> = {}
  for (const [table, tabs] of Object.entries(
    filter as Record<string, Record<string, unknown>[]>,
  )) {
    const sparseTabs = tabs
      .map((tab) =>
        Object.fromEntries(
          Object.entries(tab).filter(
            ([key, value]) => isSet(value) && key !== 'id',
          ),
        ),
      )
      .filter((tab) => Object.keys(tab).length > 0)
    if (sparseTabs.length > 0) sparse[table] = sparseTabs
  }
  return Object.keys(sparse).length > 0 ? sparse : null
}

// sparse tabs only carry the set values: fill every known field back in
// so the atom's full shape (all keys present) is restored
const sparseToDataFilter = (sparse: Record<string, unknown>): DataFilter => {
  const result: DataFilter = { ...initialDataFilterValues }
  for (const table of Object.keys(
    initialDataFilterValues,
  ) as (keyof DataFilter)[]) {
    const tabs = sparse[table]
    if (!Array.isArray(tabs)) continue
    const initialTab = (
      initialDataFilterValues[table] as Record<string, unknown>[]
    )[0]
    if (!initialTab) continue
    const fullTabs = tabs
      .filter(
        (tab): tab is Record<string, unknown> =>
          typeof tab === 'object' && tab !== null,
      )
      .map((tab) =>
        Object.fromEntries(
          Object.keys(initialTab).map((field) => [field, tab[field] ?? null]),
        ),
      )
    if (fullTabs.length > 0) {
      ;(result as Record<string, unknown>)[table] = fullTabs
    }
  }
  return result
}

export const encodeDataFilterParam = (filter: DataFilter): string | null => {
  const sparse = buildSparseDataFilter(filter)
  if (!sparse) return null
  return bytesToB64url(new TextEncoder().encode(JSON.stringify(sparse)))
}

// returns undefined for malformed values (hand-edited or truncated
// links) — callers drop the param in that case
export const decodeDataFilterParam = (
  value: string | null | undefined,
): DataFilter | undefined => {
  if (!value) return undefined
  try {
    const sparse = JSON.parse(new TextDecoder().decode(b64urlToBytes(value)))
    if (typeof sparse !== 'object' || sparse === null) return undefined
    return sanitizeDataFilter(sparseToDataFilter(sparse))
  } catch {
    return undefined
  }
}
