import { store, treeNodeLabelFilterAtom } from '../store/index.ts'

export const getEkfrequenzGqlFilterForTree = (apId: string) => {
  const nodeLabelFilter = store.get(treeNodeLabelFilterAtom)
  const gqlFilter = {}

  // Don't include apId in filter - query is already scoped to ap
  if (nodeLabelFilter.ekfrequenz) {
    gqlFilter.code = {
      includesInsensitive: nodeLabelFilter.ekfrequenz,
    }
  }

  if (Object.keys(gqlFilter).length === 0) return { or: [] }

  return gqlFilter
}
