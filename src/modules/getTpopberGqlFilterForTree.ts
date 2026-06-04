import { store, treeNodeLabelFilterAtom } from '../store/index.ts'

export const getTpopberGqlFilterForTree = (tpopId: string) => {
  const nodeLabelFilter = store.get(treeNodeLabelFilterAtom)
  const gqlFilter = {}

  // Don't include tpopId in filter - query is already scoped to tpop
  if (nodeLabelFilter.tpopber) {
    gqlFilter.label = {
      includesInsensitive: nodeLabelFilter.tpopber,
    }
  }

  if (Object.keys(gqlFilter).length === 0) return { or: [] }

  return gqlFilter
}
