import sortBy from 'lodash/sortBy'

export default (store) => {
  const { table, tree } = store
  const { nodeLabelFilter } = tree
  // grab projekte as array and sort them by name
  let projekte = Array.from(table.projekt.values())
  // filter by nodeLabelFilter
  const filterString = nodeLabelFilter.get(`projekt`)
  if (filterString) {
    projekte = projekte.filter(p =>
      p.ProjName
        .toLowerCase()
        .includes(filterString.toLowerCase())
    )
  }
  // sort
  projekte = sortBy(projekte, `ProjName`)
  return projekte
}
