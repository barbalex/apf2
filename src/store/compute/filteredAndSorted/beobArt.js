import sortBy from 'lodash/sortBy'

export default (store: Object, tree: Object): Array<Object> => {
  const { table } = store
  const { nodeLabelFilter } = tree
  const { adb_eigenschaften } = table
  // grab beobArt as array and sort them by year
  let beobArt = Array.from(table.beob_art.values())

  // sort
  // need to add artnameVollständig to sort and filter by nodeLabelFilter
  if (adb_eigenschaften.size > 0) {
    beobArt.forEach(x => {
      const ae = adb_eigenschaften.get(x.TaxonomieId)
      return (x.label = ae ? ae.Artname : '(keine Art gewählt)')
    })
    // filter by nodeLabelFilter
    const filterString = nodeLabelFilter.get('beobArt')
    if (filterString) {
      beobArt = beobArt.filter(p =>
        p.label.toLowerCase().includes(filterString.toLowerCase())
      )
    }
    // sort by label
    beobArt = sortBy(beobArt, 'label')
  }
  return beobArt
}
