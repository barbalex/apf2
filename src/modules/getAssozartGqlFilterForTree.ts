import type { AssozartFilter } from '../gql/graphql.ts'
import { store, treeNodeLabelFilterAtom } from '../store/index.ts'

export const getAssozartGqlFilterForTree = (_apId: string) => {
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
