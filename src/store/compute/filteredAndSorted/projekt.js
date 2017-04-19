import sortBy from 'lodash/sortBy'

export default (store, tree) => {
  const { table } = store
  const { nodeLabelFilter } = tree

  // grab projekte as array
  let projekte = Array.from(table.projekt.values())

  // filter by nodeLabelFilter
  const filterString = nodeLabelFilter.get(`projekt`)
  if (filterString) {
    projekte = projekte.filter(p =>
      p.ProjName.toLowerCase().includes(filterString.toLowerCase())
    )
  }

  // sort by name
  projekte = sortBy(projekte, `ProjName`)

  return projekte
}
