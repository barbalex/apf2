import type { ZielFilter } from '../modules/gqlFilterTypes.ts'
import { treeNodeLabelFilterAtom } from '../store/index.ts'
import type { Store } from 'jotai'

export const getZielGqlFilterForTree = (store: Store, _apId: string) => {
  const nodeLabelFilter = store.get(treeNodeLabelFilterAtom)
  const gqlFilter: ZielFilter = {}
  const or: ZielFilter[] = []

  // Don't include apId in filter - query is already scoped to ap
  if (nodeLabelFilter.ziel) {
    or.push({ label: { includesInsensitive: nodeLabelFilter.ziel } })
    if (!isNaN(+nodeLabelFilter.ziel)) {
      or.push({ jahr: { equalTo: +nodeLabelFilter.ziel } })
    }
    gqlFilter.or = or
  }

  if (Object.keys(gqlFilter).length === 0) return { or: [] }

  return gqlFilter
}
