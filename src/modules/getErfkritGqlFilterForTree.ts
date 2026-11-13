import type { ErfkritFilter } from '../modules/gqlFilterTypes.ts'
import { treeNodeLabelFilterAtom } from '../store/index.ts'
import type { Store } from 'jotai'

export const getErfkritGqlFilterForTree = (store: Store, _apId: string) => {
  const nodeLabelFilter = store.get(treeNodeLabelFilterAtom)
  const gqlFilter: ErfkritFilter = {}

  // Don't include apId in filter - query is already scoped to ap
  if (nodeLabelFilter.erfkrit) {
    gqlFilter.label = {
      includesInsensitive: nodeLabelFilter.erfkrit,
    }
  }

  if (Object.keys(gqlFilter).length === 0) return { or: [] }

  return gqlFilter
}
