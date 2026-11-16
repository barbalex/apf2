import type { AssozartFilter } from '../modules/gqlFilterTypes.ts'
import { treeNodeLabelFilterAtom } from '../store/index.ts'
import type { Store } from 'jotai'

export const getAssozartGqlFilterForTree = (store: Store, _apId: string) => {
  const nodeLabelFilter = store.get(treeNodeLabelFilterAtom)
  const gqlFilter: AssozartFilter = {}

  // Don't include apId in filter - query is already scoped to ap
  if (nodeLabelFilter.assozart) {
    gqlFilter.label = {
      includesInsensitive: nodeLabelFilter.assozart,
    }
  }

  if (Object.keys(gqlFilter).length === 0) return { or: [] }

  return gqlFilter
}
