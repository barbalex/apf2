import sortBy from 'lodash/sortBy'

export default (store: Object, tree: Object): Array<Object> => {
  const { table } = store
  const { nodeLabelFilter } = tree
  const { adb_eigenschaften } = table
  // grab beobart as array and sort them by year
  let beobart = Array.from(table.beobart.values())

  // sort
  // need to add artnameVollständig to sort and filter by nodeLabelFilter
  if (adb_eigenschaften.size > 0) {
    beobart.forEach(x => {
      const ae = adb_eigenschaften.get(x.TaxonomieId)
      return (x.label = ae ? ae.Artname : '(keine Art gewählt)')
    })
    // filter by nodeLabelFilter
    const filterString = nodeLabelFilter.get('beobart')
    if (filterString) {
      beobart = beobart.filter(p =>
        p.label.toLowerCase().includes(filterString.toLowerCase())
      )
    }
    // sort by label
    beobart = sortBy(beobart, 'label')
  }
  return beobart
}
