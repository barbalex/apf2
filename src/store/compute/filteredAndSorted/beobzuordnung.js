import sortBy from 'lodash/sortBy'
import format from 'date-fns/format'

export default (store: Object, tree: Object): Object => {
  const { table } = store
  const { nodeLabelFilter, apFilter } = tree
  // grab beob as array and sort them by year
  let beobNichtBeurteilt = Array.from(table.beob.values())
    // filter by apFilter
    .filter(b => {
      if (!apFilter) return true
      const ap = table.ap.get(b.ArtId)
      return [1, 2, 3].includes(ap.ApStatus)
    })
    // fetch only those without beobzuordnung
    .filter(b => {
      const beobzuordnung = store.table.beobzuordnung.get(b.BeobId)
      const hasBeobzuordnung =
        beobzuordnung &&
        (beobzuordnung.TPopId || beobzuordnung.BeobNichtZuordnen)
      return !hasBeobzuordnung
    })

  beobNichtBeurteilt.forEach(el => {
    const quelle = table.beob_quelle.get(el.QuelleId)
    const quelleName = quelle && quelle.name ? quelle.name : ``
    const datum = el.Datum ? format(el.Datum, 'YYYY.MM.DD') : '(kein Datum)'
    el.label = `${datum}: ${el.Autor || `(kein Autor)`} (${quelleName})`
  })
  // filter by nodeLabelFilter
  const filterString = nodeLabelFilter.get(`beobzuordnung`)
  if (filterString) {
    beobNichtBeurteilt = beobNichtBeurteilt.filter(p =>
      p.label.toLowerCase().includes(filterString.toLowerCase()),
    )
  }
  // sort by label and return
  return sortBy(beobNichtBeurteilt, `label`).reverse()
}
