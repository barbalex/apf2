import {
  store,
  treeNodeLabelFilterAtom,
  treeMapFilterAtom,
  getGqlFilterAtomByTable,
} from '../store/index.ts'
import type { Atom } from 'jotai'

export const tableIsFiltered = ({ table }: { table: string }) => {
  // check nodeLabelFilter
  const nodeLabelFilter = store.get(treeNodeLabelFilterAtom)
  const nodeLabelFilterExists = !!nodeLabelFilter[table]
  if (nodeLabelFilterExists) return true
  // check mapFilter in tables with (parent) coordinates
  const mapFilter = store.get(treeMapFilterAtom)
  if (
    ['pop', 'tpop', 'tpopfeldkontr', 'tpopfreiwkontr', 'tpopmassn'].includes(
      table,
    ) &&
    mapFilter
  ) {
    return true
  }
  // check data and hierarchy filter: is included in gqlFilter
  // check gql filter
  const gqlFilterAtom = getGqlFilterAtomByTable(table)
  if (!gqlFilterAtom) return false

  const gqlFilter =
    (store.get(gqlFilterAtom as Atom<{ filtered?: { or?: object[] } }>)?.filtered
      ?.or?.[0] as Record<string, unknown> | undefined) ?? {}
  const isGqlFilter = Object.keys(gqlFilter).length > 0
  return isGqlFilter
}
