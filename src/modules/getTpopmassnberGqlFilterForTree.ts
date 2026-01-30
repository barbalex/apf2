import { store, treeNodeLabelFilterAtom } from '../store/index.ts'

export const getTpopmassnberGqlFilterForTree = (tpopId: string) => {
  const nodeLabelFilter = store.get(treeNodeLabelFilterAtom)
  const gqlFilter = {}

  // Don't include tpopId in filter - query is already scoped to tpop
  if (nodeLabelFilter.tpopmassnber) {
    gqlFilter.label = {
      includesInsensitive: nodeLabelFilter.tpopmassnber,
    }
  }

  if (Object.keys(gqlFilter).length === 0) return { or: [] }

  return gqlFilter
}
