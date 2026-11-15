// the saved data filter (apflora.saved_filter) is addressed by a single
// ?savedFilter=<id> search param, so filter views are linkable.
// Applied by SavedFilterSetter, written by the Filter panel's save/load
// actions — in the tree2 pane these resolve to the pane's own router
export const savedFilterParamName = 'savedFilter'

export const setSavedFilterParam = (
  searchParams: URLSearchParams,
  id: string | null,
): URLSearchParams => {
  const next = new URLSearchParams(searchParams)
  if (id) next.set(savedFilterParamName, id)
  else next.delete(savedFilterParamName)
  return next
}
