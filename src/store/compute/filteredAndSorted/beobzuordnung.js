import sortBy from 'lodash/sortBy'

export default (store, tree) => {
  const { table } = store
  const { activeNodes, nodeLabelFilter, apFilter } = tree
  // grab beob_bereitgestellt as array and sort them by year
  let beobNichtBeurteilt = Array.from(table.beob_bereitgestellt.values())
    // show only nodes of active ap
    .filter(a => a.NO_ISFS === activeNodes.ap)
    // filter by apFilter
    .filter((b) => {
      if (!apFilter) return true
      const ap = table.ap.get(b.NO_ISFS)
      return [1, 2, 3].includes(ap.ApStatus)
    })

  beobNichtBeurteilt.forEach((el) => {
    const quelle = table.beob_quelle.get(el.QuelleId)
    const quelleName = quelle && quelle.name ? quelle.name : ``
    el.label = `${el.Datum || `(kein Datum)`}: ${el.Autor || `(kein Autor)`} (${quelleName})`
  })
  // filter by nodeLabelFilter
  const filterString = nodeLabelFilter.get(`beobzuordnung`)
  if (filterString) {
    beobNichtBeurteilt = beobNichtBeurteilt.filter(p =>
      p.label.toLowerCase().includes(filterString.toLowerCase())
    )
  }
  // sort by label and return
  return sortBy(beobNichtBeurteilt, `label`).reverse()
}
