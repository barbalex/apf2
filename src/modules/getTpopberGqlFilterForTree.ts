import type { TpopberFilter } from '../modules/gqlFilterTypes.ts'
import { treeNodeLabelFilterAtom } from '../store/index.ts'
import type { Store } from 'jotai'

export const getTpopberGqlFilterForTree = (store: Store, _tpopId: string) => {
  const nodeLabelFilter = store.get(treeNodeLabelFilterAtom)
  const gqlFilter: TpopberFilter = {}

  // Don't include tpopId in filter - query is already scoped to tpop
  if (nodeLabelFilter.tpopber) {
    gqlFilter.label = {
      includesInsensitive: nodeLabelFilter.tpopber,
    }
  }

  if (Object.keys(gqlFilter).length === 0) return { or: [] }

  return gqlFilter
}
