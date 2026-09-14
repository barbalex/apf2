import type { TpopmassnberFilter } from '../gql/graphql.ts'
import { store, treeNodeLabelFilterAtom } from '../store/index.ts'

export const getTpopmassnberGqlFilterForTree = (_tpopId: string) => {
  const nodeLabelFilter = store.get(treeNodeLabelFilterAtom)
  const gqlFilter: TpopmassnberFilter = {}

  // Don't include tpopId in filter - query is already scoped to tpop
  if (nodeLabelFilter.tpopmassnber) {
    gqlFilter.label = {
      includesInsensitive: nodeLabelFilter.tpopmassnber,
    }
  }

  if (Object.keys(gqlFilter).length === 0) return { or: [] }

  return gqlFilter
}
