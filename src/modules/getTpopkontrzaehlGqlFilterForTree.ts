import type { TpopkontrzaehlFilter } from '../modules/gqlFilterTypes.ts'
import { treeNodeLabelFilterAtom } from '../store/index.ts'
import type { Store } from 'jotai'

export const getTpopkontrzaehlGqlFilterForTree = (
  store: Store,
  _tpopkontrId: string,
) => {
  const nodeLabelFilter = store.get(treeNodeLabelFilterAtom)
  const gqlFilter: TpopkontrzaehlFilter = {}

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
