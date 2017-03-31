import sortBy from 'lodash/sortBy'

export default (store) => {
  const { activeUrlElements, table, node } = store
  // grab beob_bereitgestellt as array and sort them by year
  let beobNichtBeurteilt = Array.from(table.beob_bereitgestellt.values())
    // show only nodes of active ap
    .filter(a => a.NO_ISFS === activeUrlElements.ap)
    // filter by node.apFilter
    .filter((b) => {
      if (!node.apFilter) return true
      const ap = table.ap.get(b.NO_ISFS)
      return [1, 2, 3].includes(ap.ApStatus)
    })

  beobNichtBeurteilt.forEach((el) => {
    const quelle = table.beob_quelle.get(el.QuelleId)
    const quelleName = quelle && quelle.name ? quelle.name : ``
    el.label = `${el.Datum || `(kein Datum)`}: ${el.Autor || `(kein Autor)`} (${quelleName})`
  })
  // filter by node.nodeLabelFilter
  const filterString = node.nodeLabelFilter.get(`beobzuordnung`)
  if (filterString) {
    beobNichtBeurteilt = beobNichtBeurteilt.filter(p =>
      p.label.toLowerCase().includes(filterString.toLowerCase())
    )
  }
  // sort by label and return
  return sortBy(beobNichtBeurteilt, `label`).reverse()
}
