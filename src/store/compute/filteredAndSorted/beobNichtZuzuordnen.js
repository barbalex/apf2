import sortBy from 'lodash/sortBy'

export default (store, tree) => {
  const { table } = store
  const { activeNodes, nodeLabelFilter, apFilter } = tree
  // grab beobNichtZuzuordnen as array and sort them by year
  let beobNichtZuzuordnen = Array
    .from(table.beobzuordnung.values())
    .filter(b => b.BeobNichtZuordnen === 1)
    // show only nodes of active ap
    .filter(a => (
      a.beobBereitgestellt &&
      a.beobBereitgestellt.NO_ISFS &&
      a.beobBereitgestellt.NO_ISFS === activeNodes.ap
    ))
    // filter by apFilter
    .filter((b) => {
      if (!apFilter) return true
      let ap
      const beob = table.beob_bereitgestellt.get(b.NO_NOTE)
      if (beob) ap = table.ap.get(beob.NO_ISFS)
      if (ap) return [1, 2, 3].includes(ap.ApStatus)
      return true
    })

  // add label
  beobNichtZuzuordnen.forEach((el) => {
    let datum = ``
    let autor = ``
    const beobBereitgestellt = table.beob_bereitgestellt.get(el.NO_NOTE)
    if (beobBereitgestellt) {
      if (beobBereitgestellt.Datum) {
        datum = beobBereitgestellt.Datum
      }
      if (beobBereitgestellt.Autor) {
        autor = beobBereitgestellt.Autor
      }
    }
    const quelle = table.beob_quelle.get(el.QuelleId)
    const quelleName = quelle && quelle.name ? quelle.name : ``
    el.label  = `${datum || `(kein Datum)`}: ${autor || `(kein Autor)`} (${quelleName})`
  })
  // filter by nodeLabelFilter
  const filterString = nodeLabelFilter.get(`beobNichtZuzuordnen`)
  if (filterString) {
    beobNichtZuzuordnen = beobNichtZuzuordnen.filter(p =>
      p.label.toLowerCase().includes(filterString.toLowerCase())
    )
  }
  // sort by label
  beobNichtZuzuordnen = sortBy(beobNichtZuzuordnen, `label`).reverse()
  return beobNichtZuzuordnen
}
