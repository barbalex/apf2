import sortBy from 'lodash/sortBy'

export default (store) => {
  const { activeUrlElements, table, tree } = store
  const { adb_eigenschaften } = table
  // grab ap as array and sort them by name
  let ap = Array.from(table.ap.values())
  // show only ap of active projekt
  ap = ap.filter(a => a.ProjId === activeUrlElements.projekt)
  // filter by tree.apFilter
  if (tree.apFilter) {
    // ApStatus between 3 and 5
    ap = ap.filter(a => [1, 2, 3].includes(a.ApStatus))
  }
  // sort
  // need to add artnameVollständig to sort and filter by nodeLabelFilter
  if (adb_eigenschaften.size > 0) {
    ap.forEach(x => {
      const ae = adb_eigenschaften.get(x.ApArtId)
      return x.label = ae ? ae.Artname : `(keine Art gewählt)`
    })
    // filter by tree.nodeLabelFilter
    const filterString = tree.nodeLabelFilter.get(`ap`)
    if (filterString) {
      ap = ap.filter(p =>
        p.label.toLowerCase().includes(filterString.toLowerCase())
      )
    }
    ap = sortBy(ap, `label`)
  }
  return ap
}
