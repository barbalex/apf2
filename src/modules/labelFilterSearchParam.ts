// the tree node label filter (treeNodeLabelFilterAtom) is kept in the
// url as one readable search param per node type
// (?labelFilter.pop=Eg&labelFilter.tpop=Zuerich), so label-filtered
// tree views are linkable. Absent params mean no filter for that type
import { initialTreeNodeLabelFilter } from '../store/tree.ts'

export type LabelFilterUrlState = Record<string, string>

export const labelFilterPrefix = 'labelFilter.'

// the entries present (and non-empty) in the params; unknown node
// types (hand-edited links) are dropped, like the f param's sanitizer
export const readLabelFilterFromSearchParams = (
  params: URLSearchParams,
): LabelFilterUrlState => {
  const knownTypes = new Set(Object.keys(initialTreeNodeLabelFilter))
  const result: LabelFilterUrlState = {}
  for (const [key, value] of params.entries()) {
    if (!key.startsWith(labelFilterPrefix) || !value) continue
    const type = key.slice(labelFilterPrefix.length)
    if (knownTypes.has(type)) result[type] = value
  }
  return result
}

// canonical string of the labelFilter params a filter state produces —
// the basis for comparing what the url carries against what it should
export const labelFilterSearchString = (
  entries: LabelFilterUrlState,
): string => {
  const nonEmpty = Object.entries(entries).filter(([, v]) => v)
  nonEmpty.sort(([a], [b]) => a.localeCompare(b))
  return nonEmpty
    .map(([type, value]) => `${labelFilterPrefix}${type}=${value}`)
    .join('&')
}

// returns params with every labelFilter param replaced from the filter,
// in canonical (sorted) order
export const writeLabelFilterToSearchParams = (
  params: URLSearchParams,
  entries: LabelFilterUrlState,
): URLSearchParams => {
  const next = new URLSearchParams()
  for (const [key, value] of params.entries()) {
    if (!key.startsWith(labelFilterPrefix)) next.append(key, value)
  }
  const nonEmpty = Object.entries(entries)
    .filter(([, v]) => v)
    .sort(([a], [b]) => a.localeCompare(b))
  for (const [type, value] of nonEmpty) {
    next.append(`${labelFilterPrefix}${type}`, value)
  }
  return next
}
