import type { ApberFilter } from '../modules/gqlFilterTypes.ts'
import { treeNodeLabelFilterAtom } from '../store/index.ts'
import type { Store } from 'jotai'

export const getApberGqlFilterForTree = (store: Store, _apId: string) => {
  const nodeLabelFilter = store.get(treeNodeLabelFilterAtom)
  const gqlFilter: ApberFilter = {}

  // Don't include apId in filter - query is already scoped to ap
  if (nodeLabelFilter.apber) {
    gqlFilter.label = {
      includesInsensitive: nodeLabelFilter.apber,
    }
  }

  if (Object.keys(gqlFilter).length === 0) return { or: [] }

  return gqlFilter
}
