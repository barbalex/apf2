import type { PopberFilter } from '../modules/gqlFilterTypes.ts'
import { treeNodeLabelFilterAtom } from '../store/index.ts'
import type { Store } from 'jotai'

export const getPopberGqlFilterForTree = (store: Store, _popId: string) => {
  const nodeLabelFilter = store.get(treeNodeLabelFilterAtom)
  const gqlFilter: PopberFilter = {}

  // Don't include popId in filter - query is already scoped to pop
  if (nodeLabelFilter.popber) {
    gqlFilter.label = {
      includesInsensitive: nodeLabelFilter.popber,
    }
  }

  if (Object.keys(gqlFilter).length === 0) return { or: [] }

  return gqlFilter
}
