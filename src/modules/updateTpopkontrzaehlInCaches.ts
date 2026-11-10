import type { QueryClient } from '@tanstack/react-query'

import type { TpopkontrId } from '../models/apflora/Tpopkontr.ts'
import type { TpopkontrzaehlId } from '../models/apflora/Tpopkontrzaehl.ts'

/**
 * a tpopkontrzaehl row as the zaehl forms cache it: the fields their
 * queries select (v_tpopkontr embeds tpopkontrId as well)
 */
interface ZaehlRow {
  id: TpopkontrzaehlId
  tpopkontrId?: TpopkontrId | null
  einheit: number | null
  anzahl: number | null
  methode: number | null
}

/** fields a save may change; undefined means "leave the cached value" */
export interface TpopkontrzaehlPatch {
  id: TpopkontrzaehlId
  einheit?: number | null
  anzahl?: number | null
  methode?: number | null
}

/**
 * structural slice of the ['tpopkontrzaehl', …] query caches — the Count
 * rows and the Zählung form differ in the werte lists they also hold
 */
interface ZaehlQueryData {
  tpopkontrzaehlById?: ZaehlRow | null
  /** only the Zählung form caches the sibling rows for its einheit filter */
  otherZaehlOfEk?: { nodes: { id: TpopkontrzaehlId; einheit: number | null }[] }
}

/** structural slice of the ['TpopkontrQuery', …] caches (freiwkontr form) */
interface TpopkontrQueryData {
  tpopkontrById?: {
    tpopkontrzaehlsByTpopkontrId?: { nodes: ZaehlRow[] } | null
  } | null
}

const buildOverrides = ({
  einheit,
  anzahl,
  methode,
}: Omit<TpopkontrzaehlPatch, 'id'>): Partial<ZaehlRow> => {
  const overrides: Partial<ZaehlRow> = {}
  // null clears a field, undefined leaves the cached value alone
  if (einheit !== undefined) overrides.einheit = einheit
  if (anzahl !== undefined) overrides.anzahl = anzahl
  if (methode !== undefined) overrides.methode = methode
  return overrides
}

/**
 * A successful PATCH already knows the row's new state — write it into
 * the query caches instead of refetching (#837): every observer (EKF
 * side panel, Daten form, Zählung form) updates with zero round trips.
 * The nav-tree queries still need their background refetch for labels.
 */
export const updateTpopkontrzaehlInCaches = ({
  tsQueryClient,
  row,
}: {
  tsQueryClient: QueryClient
  row: TpopkontrzaehlPatch
}) => {
  const overrides = buildOverrides(row)

  tsQueryClient.setQueriesData<ZaehlQueryData>(
    { queryKey: ['tpopkontrzaehl'] },
    (old) => {
      if (!old) return old
      const next: ZaehlQueryData = { ...old }
      if (old.tpopkontrzaehlById?.id === row.id) {
        next.tpopkontrzaehlById = { ...old.tpopkontrzaehlById, ...overrides }
      }
      if (old.otherZaehlOfEk?.nodes?.some((n) => n.id === row.id)) {
        next.otherZaehlOfEk = {
          nodes: old.otherZaehlOfEk.nodes.map((n) =>
            n.id === row.id ? { ...n, ...overrides } : n,
          ),
        }
      }
      return next
    },
  )

  tsQueryClient.setQueriesData<TpopkontrQueryData>(
    { queryKey: ['TpopkontrQuery'] },
    (old) => {
      const nodes = old?.tpopkontrById?.tpopkontrzaehlsByTpopkontrId?.nodes
      if (!old || !nodes?.some((n) => n.id === row.id)) return old
      return {
        ...old,
        tpopkontrById: {
          ...old.tpopkontrById,
          tpopkontrzaehlsByTpopkontrId: {
            nodes: nodes.map((n) => (n.id === row.id ? { ...n, ...overrides } : n)),
          },
        },
      }
    },
  )
}

/**
 * append a freshly inserted zaehl row to the open freiwkontr forms so the
 * new Zähleinheit appears without refetching the whole kontr (#837)
 */
export const appendTpopkontrzaehlToKontrCache = ({
  tsQueryClient,
  tpopkontrId,
  id,
}: {
  tsQueryClient: QueryClient
  tpopkontrId: TpopkontrId
  id: TpopkontrzaehlId
}) => {
  tsQueryClient.setQueriesData<TpopkontrQueryData>(
    { queryKey: ['TpopkontrQuery', tpopkontrId] },
    (old) => {
      const kontr = old?.tpopkontrById
      if (!old || !kontr || kontr.tpopkontrzaehlsByTpopkontrId === undefined)
        return old
      const nodes = kontr.tpopkontrzaehlsByTpopkontrId?.nodes ?? []
      if (nodes.some((n) => n.id === id)) return old
      const newRow: ZaehlRow = {
        id,
        tpopkontrId,
        einheit: null,
        anzahl: null,
        methode: null,
      }
      return {
        ...old,
        tpopkontrById: {
          ...kontr,
          tpopkontrzaehlsByTpopkontrId: { nodes: [...nodes, newRow] },
        },
      }
    },
  )
}
