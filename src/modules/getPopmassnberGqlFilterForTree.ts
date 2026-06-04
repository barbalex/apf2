import { store, treeNodeLabelFilterAtom } from '../store/index.ts'

export const getPopmassnberGqlFilterForTree = (popId: string) => {
  const nodeLabelFilter = store.get(treeNodeLabelFilterAtom)
  const gqlFilter = {}

  // Don't include popId in filter - query is already scoped to pop
  if (nodeLabelFilter.popmassnber) {
    gqlFilter.label = {
      includesInsensitive: nodeLabelFilter.popmassnber,
    }
  }

  if (Object.keys(gqlFilter).length === 0) return { or: [] }

  return gqlFilter
}
