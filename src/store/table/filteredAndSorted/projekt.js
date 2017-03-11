import sortBy from 'lodash/sortBy'

export default (store) => {
  const { table, node } = store
  // grab projekte as array and sort them by name
  let projekte = Array.from(table.projekt.values())
  // filter by node.nodeLabelFilter
  const filterString = node.nodeLabelFilter.get(`projekt`)
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
