import type { EkfrequenzFilter } from '../gql/graphql.ts'
import { store, treeNodeLabelFilterAtom } from '../store/index.ts'

export const getEkfrequenzGqlFilterForTree = (_apId: string) => {
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
