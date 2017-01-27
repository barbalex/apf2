import sortBy from 'lodash/sortBy'

export default ({ store, projId, apArtId, popId }) => {
  const { activeUrlElements } = store
  // grab popmassnber as array and sort them by year
  let popmassnber = Array.from(store.table.popmassnber.values())
  // show only nodes of active ap
  popmassnber = popmassnber.filter(a => a.PopId === popId)
  // get erfkritWerte
  const tpopmassnErfbeurtWerte = Array.from(store.table.tpopmassn_erfbeurt_werte.values())
  // map through all projekt and create array of nodes
  let nodes = popmassnber.map((el) => {
    const tpopmassnErfbeurtWert = tpopmassnErfbeurtWerte.find(e => e.BeurteilId === el.PopMassnBerErfolgsbeurteilung)
    const beurteilTxt = tpopmassnErfbeurtWert ? tpopmassnErfbeurtWert.BeurteilTxt : null
    return {
      nodeType: `table`,
      menuType: `popmassnber`,
      id: el.PopMassnBerId,
      parentId: popId,
      label: `${el.PopMassnBerJahr || `(kein Jahr)`}: ${beurteilTxt || `(nicht beurteilt)`}`,
      expanded: el.PopMassnBerId === activeUrlElements.popmassnber,
      url: [`Projekte`, projId, `Arten`, apArtId, `Populationen`, popId, `Massnahmen-Berichte`, el.PopMassnBerId],
    }
  })
  // filter by node.nodeLabelFilter
  const filterString = store.node.nodeLabelFilter.get(`popmassnber`)
  if (filterString) {
    nodes = nodes.filter(p =>
      p.label.toLowerCase().includes(filterString.toLowerCase())
    )
  }
  // sort by label and return
  return sortBy(nodes, `label`)
}
