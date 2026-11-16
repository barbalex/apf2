// A filter from the url (?f=) is user data that lands in
// treeDataFilterAtom: sanitize it so unknown tables, unknown field
// names (after renames) or a malformed shape cannot break the filter
// cascade or the Filter panels
import { initialDataFilterValues } from '../store/initialDataFilterValues.ts'

type DataFilter = typeof initialDataFilterValues

export const sanitizeDataFilter = (value: unknown): DataFilter => {
  const result: DataFilter = { ...initialDataFilterValues }
  if (typeof value !== 'object' || value === null) return result
  const source = value as Record<string, unknown>
  for (const table of Object.keys(
    initialDataFilterValues,
  ) as (keyof DataFilter)[]) {
    const tableValue = source[table]
    if (!Array.isArray(tableValue)) continue
    const initialTab = (initialDataFilterValues[table] as Record<
      string,
      unknown
    >[])[0]
    const knownFields = initialTab ? Object.keys(initialTab) : []
    const tabs = tableValue
      .filter(
        (tab): tab is Record<string, unknown> =>
          typeof tab === 'object' && tab !== null,
      )
      .map((tab) =>
        Object.fromEntries(
          knownFields
            .filter((field) => field in tab)
            .map((field) => [field, tab[field] ?? null]),
        ),
      )
      .filter((tab) => Object.keys(tab).length > 0)
    if (tabs.length > 0) {
      ;(result as Record<string, unknown>)[table] = tabs
    }
  }
  return result
}
