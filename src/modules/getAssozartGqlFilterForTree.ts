import { store, treeNodeLabelFilterAtom } from '../store/index.ts'

export const getAssozartGqlFilterForTree = (apId: string) => {
  const nodeLabelFilter = store.get(treeNodeLabelFilterAtom)
  const gqlFilter = {}

  // Don't include apId in filter - query is already scoped to ap
  if (nodeLabelFilter.assozart) {
    gqlFilter.label = {
      includesInsensitive: nodeLabelFilter.assozart,
    }
  }

  if (Object.keys(gqlFilter).length === 0) return { or: [] }

  return gqlFilter
}
