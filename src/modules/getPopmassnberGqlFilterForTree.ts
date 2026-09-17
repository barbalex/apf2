import type { PopmassnberFilter } from '../gql/graphql.ts'
import { store, treeNodeLabelFilterAtom } from '../store/index.ts'

export const getPopmassnberGqlFilterForTree = (_popId: string) => {
  const nodeLabelFilter = store.get(treeNodeLabelFilterAtom)
  const gqlFilter: PopmassnberFilter = {}

  // Don't include popId in filter - query is already scoped to pop
  if (nodeLabelFilter.popmassnber) {
    gqlFilter.label = {
      includesInsensitive: nodeLabelFilter.popmassnber,
    }
  }

  if (Object.keys(gqlFilter).length === 0) return { or: [] }

  return gqlFilter
}
