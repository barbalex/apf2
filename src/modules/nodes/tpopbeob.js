import sortBy from 'lodash/sortBy'

export default ({ store, tpopId }) => {
  const { activeUrlElements } = store
  // grab tpopbeob as array and sort them by year
  const tpopbeob = Array
    .from(store.table.beobzuordnung.values())
    .filter(b => b.TPopId === tpopId)
  // map through all and create array of nodes
  let nodes = tpopbeob.map((el) => {
    let datum = ``
    let autor = ``
    if (el.beobBereitgestellt) {
      if (el.beobBereitgestellt.Datum) {
        datum = el.beobBereitgestellt.Datum
      }
      if (el.beobBereitgestellt.Autor) {
        autor = el.beobBereitgestellt.Autor
      }
    }
    const quelle = store.table.beob_quelle.get(el.QuelleId)
    const quelleName = quelle && quelle.name ? quelle.name : ``
    const label = `${datum || `(kein Datum)`}: ${autor || `(kein Autor)`} (${quelleName})`
    const beobId = isNaN(el.NO_NOTE) ? el.NO_NOTE : parseInt(el.NO_NOTE, 10)
    return {
      nodeType: `table`,
      menuType: `tpopbeob`,
      id: beobId,
      parentId: tpopId,
      label,
      expanded: beobId === activeUrlElements.tpopbeob,
      url: [`Projekte`, activeUrlElements.projekt, `Arten`, activeUrlElements.ap, `Populationen`, activeUrlElements.pop, `Teil-Populationen`, el.TPopId, `Beobachtungen`, beobId],
    }
  })
  // filter by node.nodeLabelFilter
  const filterString = store.node.nodeLabelFilter.get(`tpopbeob`)
  if (filterString) {
    nodes = nodes.filter(p =>
      p.label.toLowerCase().includes(filterString.toLowerCase())
    )
  }
  // sort by label and return
  return sortBy(nodes, `label`).reverse()
}
