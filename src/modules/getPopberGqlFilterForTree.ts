import { store, treeNodeLabelFilterAtom } from '../store/index.ts'

export const getPopberGqlFilterForTree = (popId: string) => {
  const nodeLabelFilter = store.get(treeNodeLabelFilterAtom)
  const gqlFilter = {}

  // Don't include popId in filter - query is already scoped to pop
  if (nodeLabelFilter.popber) {
    gqlFilter.label = {
      includesInsensitive: nodeLabelFilter.popber,
    }
  }

  if (Object.keys(gqlFilter).length === 0) return { or: [] }

  return gqlFilter
}
