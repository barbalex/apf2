// @flow
import sortBy from 'lodash/sortBy'
import cloneDeep from 'lodash/cloneDeep'

export default (store: Object, tree: Object): Array<Object> => {
  const { table } = store
  const { nodeLabelFilter, apFilter } = tree
  const { adb_eigenschaften } = table
  // grab ap as array and sort them by name
  let aps = cloneDeep(Array.from(table.ap.values()))

  // filter by apFilter
  if (apFilter) {
    // ApStatus between 3 and 5
    aps = aps.filter(a => [1, 2, 3].includes(a.ApStatus))
  }
  // sort
  // need to add artnameVollständig to sort and filter by nodeLabelFilter
  if (adb_eigenschaften.size > 0) {
    aps.forEach(ap => {
      const ae = adb_eigenschaften.get(ap.ApArtId)
      return (ap.label = ae ? ae.Artname : '(keine Art gewählt)')
    })
    // filter by nodeLabelFilter
    const filterString = nodeLabelFilter.get('ap')
    if (filterString) {
      aps = aps.filter(p =>
        p.label.toLowerCase().includes(filterString.toLowerCase())
      )
    }
    aps = sortBy(aps, 'label')
  }
  return aps
}
