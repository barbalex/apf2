import type { ApberFilter } from '../gql/graphql.ts'
import { store, treeNodeLabelFilterAtom } from '../store/index.ts'

export const getApberGqlFilterForTree = (_apId: string) => {
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
