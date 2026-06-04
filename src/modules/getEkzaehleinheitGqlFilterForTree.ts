import { store, treeNodeLabelFilterAtom } from '../store/index.ts'

export const getEkzaehleinheitGqlFilterForTree = (apId: string) => {
  const nodeLabelFilter = store.get(treeNodeLabelFilterAtom)
  const gqlFilter = {}

  // Don't include apId in filter - query is already scoped to ap
  if (nodeLabelFilter.ekzaehleinheit) {
    gqlFilter.label = {
      includesInsensitive: nodeLabelFilter.ekzaehleinheit,
    }
  }

  if (Object.keys(gqlFilter).length === 0) return { or: [] }

  return gqlFilter
}
