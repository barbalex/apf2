export const tableIsFiltered = ({ table, tree }) => {
  // check nodeLabelFilter
  const nodeLabelFilterExists = !!tree.nodeLabelFilter[table]
  if (nodeLabelFilterExists) return true
  // check mapFilter in tables with (parent) coordinates
  if (
    ['pop', 'tpop', 'tpopfeldkontr', 'tpopfreiwkontr', 'tpopmassn'].includes(
      table,
    ) &&
    tree.mapFilter
  ) {
    return true
  }
  // check data and hierarchy filter: is included in gqlFilter
  // check gql filter
  const gqlFilter = tree?.[`${table}GqlFilter`]?.filtered?.or?.[0] ?? {}
  const isGqlFilter = Object.keys(gqlFilter).length > 0
  return isGqlFilter
}
