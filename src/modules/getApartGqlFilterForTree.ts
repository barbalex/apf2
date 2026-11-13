import type { ApartFilter } from '../modules/gqlFilterTypes.ts'
import { treeNodeLabelFilterAtom } from '../store/index.ts'
import type { Store } from 'jotai'

export const getApartGqlFilterForTree = (store: Store, _apId: string) => {
  const nodeLabelFilter = store.get(treeNodeLabelFilterAtom)
  const gqlFilter: ApartFilter = {}

  // Don't include apId in filter - query is already scoped to ap
  if (nodeLabelFilter.apart) {
    gqlFilter.label = {
      includesInsensitive: nodeLabelFilter.apart,
    }
  }

  if (Object.keys(gqlFilter).length === 0) return { or: [] }

  return gqlFilter
}
