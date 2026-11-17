import type { QueryClient } from '@tanstack/react-query'

/**
 * structural slice of the single-row form queries this patches:
 * ['tpopfeldkontr', id] and ['tpopfeldkontrBiotop', id] (rowKey
 * 'tpopkontrById'), ['tpopber', id] (rowKey 'tpopberById')
 */
type FormQueryData = Record<
  string,
  CachedRow | null | undefined
>

type CachedRow = { id: string } & Record<string, unknown>

/**
 * A successful PATCH already knows the row's new state — write it into the
 * form query cache instead of refetching (the Zählung forms have done this
 * since #837; the Feld-Kontrolle, Biotop and TPop-Bericht forms followed).
 * The controlled fields render from that cache, so they update with zero
 * round trips instead of waiting for the form query's parallel requests.
 * The nav-tree queries still get their background refetch for labels.
 *
 * rowKey: which property of the cached query result holds the row
 * (e.g. 'tpopmassnById'); omit it for queries that cache the row directly
 * (e.g. ['tpop', id] returns the row itself).
 */
export const updateFormRowInCaches = ({
  tsQueryClient,
  queryKey,
  rowKey,
  row,
}: {
  tsQueryClient: QueryClient
  /**
   * the form query family prefix, e.g. ['tpopfeldkontr'] — prefix-matched.
   * Deliberately WITHOUT the row id: in the running app only the prefix
   * form reliably reaches the live observer (the exact-id variant updated
   * the cache but the mounted form never re-rendered). The id guard below
   * keeps other rows' caches untouched.
   */
  queryKey: readonly unknown[]
  rowKey?: string
  /** the saved fields in camelCase, exactly as the PATCH sent them */
  row: Record<string, unknown>
}) => {
  const id = row.id
  if (typeof id !== 'string') return
  const { id: _ignored, ...overrides } = row
  if (rowKey === undefined) {
    tsQueryClient.setQueriesData<CachedRow>({ queryKey }, (old) =>
      old?.id === id ? { ...old, ...overrides } : old,
    )
    return
  }
  tsQueryClient.setQueriesData<FormQueryData>({ queryKey }, (old) => {
    const cachedRow = old?.[rowKey]
    if (!old || !cachedRow || cachedRow.id !== id) return old
    return { ...old, [rowKey]: { ...cachedRow, ...overrides } }
  })
}
