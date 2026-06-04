import { store, treeNodeLabelFilterAtom } from '../store/index.ts'

export const getZielGqlFilterForTree = (apId: string) => {
  const nodeLabelFilter = store.get(treeNodeLabelFilterAtom)
  const gqlFilter = {}

  // Don't include apId in filter - query is already scoped to ap
  if (nodeLabelFilter.ziel) {
    gqlFilter.or = [{ label: { includesInsensitive: nodeLabelFilter.ziel } }]
    if (!isNaN(nodeLabelFilter.ziel)) {
      gqlFilter.or.push({ jahr: { equalTo: +nodeLabelFilter.ziel } })
    }
  }

  if (Object.keys(gqlFilter).length === 0) return { or: [] }

  return gqlFilter
}
