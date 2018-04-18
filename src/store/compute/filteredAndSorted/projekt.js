import sortBy from 'lodash/sortBy'

export default (store: Object, tree: Object): Array<Object> => {
  const { table } = store
  const { nodeLabelFilter } = tree

  // grab projekte as array
  let projekte = Array.from(table.projekt.values())

  // filter by nodeLabelFilter
  const filterString = nodeLabelFilter.get('projekt')
  if (filterString) {
    projekte = projekte.filter(p =>
      p.name.toLowerCase().includes(filterString.toLowerCase())
    )
  }

  // sort by name
  projekte = sortBy(projekte, 'name')

  return projekte
}
