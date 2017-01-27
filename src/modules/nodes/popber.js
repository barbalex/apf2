import sortBy from 'lodash/sortBy'

export default ({ store, projId, apArtId, popId }) => {
  const { activeUrlElements } = store
  // grab popber as array and sort them by year
  let popber = Array.from(store.table.popber.values())
  // show only nodes of active ap
  popber = popber.filter(a => a.PopId === popId)
  // get erfkritWerte
  const popEntwicklungWerte = Array.from(store.table.pop_entwicklung_werte.values())
  // map through all projekt and create array of nodes
  let nodes = popber.map((el) => {
    const popEntwicklungWert = popEntwicklungWerte.find(e => e.EntwicklungId === el.PopBerEntwicklung)
    const entwicklungTxt = popEntwicklungWert ? popEntwicklungWert.EntwicklungTxt : null
    return {
      nodeType: `table`,
      menuType: `popber`,
      id: el.PopBerId,
      parentId: popId,
      label: `${el.PopBerJahr || `(kein Jahr)`}: ${entwicklungTxt || `(nicht beurteilt)`}`,
      expanded: el.PopBerId === activeUrlElements.popber,
      url: [`Projekte`, projId, `Arten`, apArtId, `Populationen`, popId, `Kontroll-Berichte`, el.PopBerId],
    }
  })
  // filter by node.nodeLabelFilter
  const filterString = store.node.nodeLabelFilter.get(`popber`)
  if (filterString) {
    nodes = nodes.filter(p =>
      p.label.toLowerCase().includes(filterString.toLowerCase())
    )
  }
  // sort by label and return
  return sortBy(nodes, `label`)
}
