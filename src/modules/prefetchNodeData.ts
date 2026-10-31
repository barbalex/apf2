// Prefetch queries for tree nodes: each menuType maps to the same
// queryOptions factory its form uses — form and prefetch share the
// queryKey AND the queryFn, so a prefetched entry always has the shape
// the form expects (the former Apollo document imports are gone).
import type { TreeNodeData } from '../components/Projekte/TreeContainer/Tree/types.ts'

import { apQueryOptions } from '../components/Projekte/Daten/Ap/Ap/Ap.tsx'
import { popQueryOptions } from '../components/Projekte/Daten/Pop/Pop.tsx'
import { tpopQueryOptions } from '../components/Projekte/Daten/Tpop/Tpop.tsx'
import { tpopberQueryOptions } from '../components/Projekte/Daten/Tpopber/index.tsx'
import { tpopmassnQueryOptions } from '../components/Projekte/Daten/Tpopmassn/Tpopmassn.tsx'
import { tpopmassnberQueryOptions } from '../components/Projekte/Daten/Tpopmassnber/index.tsx'
import { tpopfeldkontrQueryOptions } from '../components/Projekte/Daten/Tpopfeldkontr/Tpopfeldkontr.tsx'
import { tpopfreiwkontrQueryOptions } from '../components/Projekte/Daten/Tpopfreiwkontr/Tpopfreiwkontr.tsx'
import { tpopkontrzaehlQueryOptions } from '../components/Projekte/Daten/Tpopkontrzaehl/index.tsx'
import { apberQueryOptions } from '../components/Projekte/Daten/Apber/index.tsx'
import { popberQueryOptions } from '../components/Projekte/Daten/Popber/index.tsx'
import { popmassnberQueryOptions } from '../components/Projekte/Daten/Popmassnber/index.tsx'
import { idealbiotopQueryOptions } from '../components/Projekte/Daten/Idealbiotop/Idealbiotop.tsx'
import { apartQueryOptions } from '../components/Projekte/Daten/Apart/index.tsx'
import { adresseQueryOptions } from '../components/Projekte/Daten/Adresse/index.tsx'
import { ekzaehleinheitQueryOptions } from '../components/Projekte/Daten/Ekzaehleinheit/index.tsx'
import { userQueryOptions } from '../components/Projekte/Daten/User/index.tsx'
import { erfkritQueryOptions } from '../components/Projekte/Daten/Erfkrit/index.tsx'
import { zielQueryOptions } from '../components/Projekte/Daten/Ziel/Ziel.tsx'
import { assozartQueryOptions } from '../components/Projekte/Daten/Assozart/index.tsx'
import { projektQueryOptions } from '../components/Projekte/Daten/Projekt/Projekt.tsx'
import { beobQueryOptions } from '../components/Projekte/Daten/Beob/index.tsx'
import { apberuebersichtQueryOptions } from '../components/Projekte/Daten/Apberuebersicht/index.tsx'

import { getTsQueryClientFromStore } from '../store/index.ts'

interface QueryOptionsShape {
  queryKey: readonly unknown[]
  queryFn: () => Promise<unknown>
}

type NodeQueryFactory = (
  id: string,
  node: TreeNodeData,
) => QueryOptionsShape | null

// Map menu types to their form's queryOptions factory
const nodeQueryFactories: Record<string, NodeQueryFactory> = {
  ap: (id) => apQueryOptions(id),
  pop: (id) => popQueryOptions(id),
  tpop: (id) => tpopQueryOptions(id),
  tpopber: (id) => tpopberQueryOptions(id),
  tpopmassn: (id) => tpopmassnQueryOptions(id),
  tpopmassnber: (id) => tpopmassnberQueryOptions(id),
  tpopfeldkontr: (id) => tpopfeldkontrQueryOptions(id),
  tpopfreiwkontr: (id) => tpopfreiwkontrQueryOptions(id),
  tpopkontrzaehl: (id, node) =>
    tpopkontrzaehlQueryOptions(
      id,
      node?.parentTableId ? String(node.parentTableId) : undefined,
    ),
  apber: (id) => apberQueryOptions(id),
  popber: (id) => popberQueryOptions(id),
  popmassnber: (id) => popmassnberQueryOptions(id),
  idealbiotop: (id, node) =>
    idealbiotopQueryOptions(
      node?.parentTableId || node?.tableId ?
        String(node.parentTableId || node.tableId)
      : id,
    ),
  apart: (id) => apartQueryOptions(id),
  adresse: (id) => adresseQueryOptions(id),
  ekzaehleinheit: (id) => ekzaehleinheitQueryOptions(id),
  user: (id) => userQueryOptions(id),
  erfkrit: (id) => erfkritQueryOptions(id),
  ziel: (id) => zielQueryOptions(id),
  assozart: (id) => assozartQueryOptions(id),
  projekt: (id) => projektQueryOptions(id),
  // the beob form (data blob) serves all beob routes
  beobNichtZuzuordnen: (id) => beobQueryOptions(id),
  apberuebersicht: (id) => apberuebersichtQueryOptions(id),
}

export const prefetchNodeData = async (node: TreeNodeData) => {
  const { menuType, tableId, id } = node
  const tsQueryClient = getTsQueryClientFromStore()

  // Only prefetch for node types we have queries for
  const factory = nodeQueryFactories[menuType]
  if (!factory) return

  const nodeId = tableId || id
  if (!nodeId) return

  if (!tsQueryClient) return

  const options = factory(String(nodeId), node)
  if (!options) return

  // Check if data is already in cache
  const cachedData = tsQueryClient.getQueryData(options.queryKey)
  if (cachedData) return

  // Prefetch the data
  await tsQueryClient.prefetchQuery(options)
}
