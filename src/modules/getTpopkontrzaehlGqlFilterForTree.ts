import { store, treeNodeLabelFilterAtom } from '../store/index.ts'

export const getTpopkontrzaehlGqlFilterForTree = (tpopkontrId: string) => {
  const nodeLabelFilter = store.get(treeNodeLabelFilterAtom)
  const gqlFilter = {}

  // Don't include tpopkontrId in filter - query is already scoped to tpopkontr
  // Only include label filter if present
  if (nodeLabelFilter.tpopkontrzaehl) {
    gqlFilter.label = {
      includesInsensitive: nodeLabelFilter.tpopkontrzaehl,
    }
  }

  if (Object.keys(gqlFilter).length === 0) return { or: [] }

  return gqlFilter
}
