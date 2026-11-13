import type { PopmassnberFilter } from '../modules/gqlFilterTypes.ts'
import { treeNodeLabelFilterAtom } from '../store/index.ts'
import type { Store } from 'jotai'

export const getPopmassnberGqlFilterForTree = (
  store: Store,
  _popId: string,
) => {
  const nodeLabelFilter = store.get(treeNodeLabelFilterAtom)
  const gqlFilter: PopmassnberFilter = {}

  // Don't include popId in filter - query is already scoped to pop
  if (nodeLabelFilter.popmassnber) {
    gqlFilter.label = {
      includesInsensitive: nodeLabelFilter.popmassnber,
    }
  }

  if (Object.keys(gqlFilter).length === 0) return { or: [] }

  return gqlFilter
}
