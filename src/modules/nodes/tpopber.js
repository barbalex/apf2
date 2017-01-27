import sortBy from 'lodash/sortBy'

export default ({ store, projId, apArtId, popId, tpopId }) => {
  const { activeUrlElements } = store
  // grab tpopber as array and sort them by year
  let tpopber = Array.from(store.table.tpopber.values())
  // show only nodes of active ap
  tpopber = tpopber.filter(a => a.TPopId === tpopId)
  // get entwicklungWerte
  const tpopEntwicklungWerte = Array.from(store.table.tpop_entwicklung_werte.values())
  // map through all projekt and create array of nodes
  let nodes = tpopber.map((el) => {
    const tpopEntwicklungWert = tpopEntwicklungWerte.find(e => e.EntwicklungCode === el.TPopBerEntwicklung)
    const entwicklungTxt = tpopEntwicklungWert ? tpopEntwicklungWert.EntwicklungTxt : null
    return {
      nodeType: `table`,
      menuType: `tpopber`,
      parentId: tpopId,
      id: el.TPopBerId,
      label: `${el.TPopBerJahr || `(kein Jahr)`}: ${entwicklungTxt || `(nicht beurteilt)`}`,
      expanded: el.TPopBerId === activeUrlElements.tpopber,
      url: [`Projekte`, projId, `Arten`, apArtId, `Populationen`, popId, `Teil-Populationen`, tpopId, `Kontroll-Berichte`, el.TPopBerId],
    }
  })
  // filter by node.nodeLabelFilter
  const filterString = store.node.nodeLabelFilter.get(`tpopber`)
  if (filterString) {
    nodes = nodes.filter(p =>
      p.label.toLowerCase().includes(filterString.toLowerCase())
    )
  }
  // sort by label and return
  return sortBy(nodes, `label`)
}
