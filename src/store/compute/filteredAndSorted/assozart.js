import sortBy from 'lodash/sortBy'

export default (store, tree) => {
  const { table } = store
  const { activeNodes, nodeLabelFilter, apFilter } = tree
  const { adb_eigenschaften } = table
  // grab assozart as array and sort them by year
  let assozart = Array.from(table.assozart.values())
  // show only nodes of active ap
  assozart = assozart.filter(a => a.AaApArtId === activeNodes.ap)
  // filter by apFilter
  if (apFilter) {
    // ApStatus between 3 and 5
    assozart = assozart.filter((a) => {
      const ap = table.ap.get(a.AaApArtId)
      return [1, 2, 3].includes(ap.ApStatus)
    })
  }
  // sort
  // need to add artnameVollständig to sort and filter by nodeLabelFilter
  if (adb_eigenschaften.size > 0) {
    assozart.forEach(x => {
      const ae = adb_eigenschaften.get(x.AaSisfNr)
      return x.label = ae ? ae.Artname : `(keine Art gewählt)`
    })
    // filter by nodeLabelFilter
    const filterString = nodeLabelFilter.get(`assozart`)
    if (filterString) {
      assozart = assozart.filter(p =>
        p.label.toLowerCase().includes(filterString.toLowerCase())
      )
    }
    // sort by label
    assozart = sortBy(assozart, `label`)
  }
  return assozart
}
