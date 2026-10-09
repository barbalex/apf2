import type { ApartFilter } from '../gql/graphql.ts'
import { store, treeNodeLabelFilterAtom } from '../store/index.ts'

export const getApartGqlFilterForTree = (_apId: string) => {
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
