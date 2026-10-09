import type { ErfkritFilter } from '../gql/graphql.ts'
import { store, treeNodeLabelFilterAtom } from '../store/index.ts'

export const getErfkritGqlFilterForTree = (_apId: string) => {
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
