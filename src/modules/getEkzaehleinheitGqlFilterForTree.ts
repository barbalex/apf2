import type { EkzaehleinheitFilter } from '../gql/graphql.ts'
import { store, treeNodeLabelFilterAtom } from '../store/index.ts'

export const getEkzaehleinheitGqlFilterForTree = (_apId: string) => {
  const nodeLabelFilter = store.get(treeNodeLabelFilterAtom)
  const gqlFilter: EkzaehleinheitFilter = {}

  // Don't include apId in filter - query is already scoped to ap
  if (nodeLabelFilter.ekzaehleinheit) {
    gqlFilter.label = {
      includesInsensitive: nodeLabelFilter.ekzaehleinheit,
    }
  }

  if (Object.keys(gqlFilter).length === 0) return { or: [] }

  return gqlFilter
}
