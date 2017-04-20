import sortBy from 'lodash/sortBy'

export default (store: Object, tree: Object): Object => {
  const { table } = store
  const { nodeLabelFilter } = tree
  // grab tpopbeob as array and sort them by year
  let tpopbeob = Array.from(table.beobzuordnung.values()).filter(
    b => b.beobNichtZuzuordnen !== 1
  )
  // map through all and create array of nodes
  tpopbeob.forEach(el => {
    let datum = ``
    let autor = ``
    const beob = table.beob_bereitgestellt.get(el.beobId)
    if (beob) {
      if (beob.Datum) {
        datum = beob.Datum
      }
      if (beob.Autor) {
        autor = beob.Autor
      }
    }
    const quelle = table.beob_quelle.get(el.QuelleId)
    const quelleName = quelle && quelle.name ? quelle.name : ``
    el.label = `${datum || `(kein Datum)`}: ${autor || `(kein Autor)`} (${quelleName})`
    el.beobId = isNaN(el.NO_NOTE) ? el.NO_NOTE : parseInt(el.NO_NOTE, 10)
  })
  // filter by nodeLabelFilter
  const filterString = nodeLabelFilter.get(`tpopbeob`)
  if (filterString) {
    tpopbeob = tpopbeob.filter(p =>
      p.label.toLowerCase().includes(filterString.toLowerCase())
    )
  }
  // sort by label and return
  return sortBy(tpopbeob, `label`).reverse()
}
