import type { EkfrequenzFilter } from '../modules/gqlFilterTypes.ts'
import { treeNodeLabelFilterAtom } from '../store/index.ts'
import type { Store } from 'jotai'

export const getEkfrequenzGqlFilterForTree = (store: Store, _apId: string) => {
  const nodeLabelFilter = store.get(treeNodeLabelFilterAtom)
  const gqlFilter: EkfrequenzFilter = {}

  // Don't include apId in filter - query is already scoped to ap
  if (nodeLabelFilter.ekfrequenz) {
    gqlFilter.code = {
      includesInsensitive: nodeLabelFilter.ekfrequenz,
    }
  }

  if (Object.keys(gqlFilter).length === 0) return { or: [] }

  return gqlFilter
}
