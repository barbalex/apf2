import sortBy from 'lodash/sortBy'

export default (store: Object, tree: Object): Object => {
  const { table } = store
  const { nodeLabelFilter, apFilter } = tree
  // grab beobNichtZuzuordnen as array and sort them by year
  let beobNichtZuzuordnen = Array.from(table.beobzuordnung.values())
    .filter(b => b.BeobNichtZuordnen === 1)
    // filter by apFilter
    .filter(b => {
      if (!apFilter) return true
      let ap
      const beob = table.beob.get(b.BeobId)
      if (beob) ap = table.ap.get(beob.ArtId)
      if (ap) return [1, 2, 3].includes(ap.ApStatus)
      return true
    })

  // add label
  beobNichtZuzuordnen.forEach(el => {
    let datum = ``
    let autor = ``
    const beobBereitgestellt = table.beob.get(el.BeobId)
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
    el.label = `${datum || `(kein Datum)`}: ${autor || `(kein Autor)`} (${quelleName})`
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
