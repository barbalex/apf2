import type { TpopberFilter } from '../gql/graphql.ts'
import { store, treeNodeLabelFilterAtom } from '../store/index.ts'

export const getTpopberGqlFilterForTree = (_tpopId: string) => {
  const nodeLabelFilter = store.get(treeNodeLabelFilterAtom)
  const gqlFilter: TpopberFilter = {}

  // Don't include tpopId in filter - query is already scoped to tpop
  if (nodeLabelFilter.tpopber) {
    gqlFilter.label = {
      includesInsensitive: nodeLabelFilter.tpopber,
    }
  }

  if (Object.keys(gqlFilter).length === 0) return { or: [] }

  return gqlFilter
}
