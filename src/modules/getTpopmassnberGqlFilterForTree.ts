import type { TpopmassnberFilter } from '../modules/gqlFilterTypes.ts'
import { treeNodeLabelFilterAtom } from '../store/index.ts'
import type { Store } from 'jotai'

export const getTpopmassnberGqlFilterForTree = (
  store: Store,
  _tpopId: string,
) => {
  const nodeLabelFilter = store.get(treeNodeLabelFilterAtom)
  const gqlFilter: TpopmassnberFilter = {}

  // Don't include tpopId in filter - query is already scoped to tpop
  if (nodeLabelFilter.tpopmassnber) {
    gqlFilter.label = {
      includesInsensitive: nodeLabelFilter.tpopmassnber,
    }
  }

  if (Object.keys(gqlFilter).length === 0) return { or: [] }

  return gqlFilter
}
