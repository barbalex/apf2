import sortBy from 'lodash/sortBy'

export default ({ store, projId, apArtId, popId, tpopId }) => {
  const { activeUrlElements } = store
  // grab tpopmassnber as array and sort them by year
  let tpopmassnber = Array.from(store.table.tpopmassnber.values())
  // show only nodes of active ap
  tpopmassnber = tpopmassnber.filter(a => a.TPopId === tpopId)
  // get erfkritWerte
  const tpopmassnErfbeurtWerte = Array.from(store.table.tpopmassn_erfbeurt_werte.values())
  // map through all projekt and create array of nodes
  let nodes = tpopmassnber.map((el) => {
    const tpopmassnErfbeurtWert = tpopmassnErfbeurtWerte.find(e => e.BeurteilId === el.TPopMassnBerErfolgsbeurteilung)
    const beurteilTxt = tpopmassnErfbeurtWert ? tpopmassnErfbeurtWert.BeurteilTxt : null
    return {
      nodeType: `table`,
      menuType: `tpopmassnber`,
      parentId: tpopId,
      id: el.TPopMassnBerId,
      label: `${el.TPopMassnBerJahr || `(kein Jahr)`}: ${beurteilTxt || `(nicht beurteilt)`}`,
      expanded: el.TPopMassnBerId === activeUrlElements.tpopmassnber,
      url: [`Projekte`, projId, `Arten`, apArtId, `Populationen`, popId, `Teil-Populationen`, tpopId, `Massnahmen-Berichte`, el.TPopMassnBerId],
    }
  })
  // filter by node.nodeLabelFilter
  const filterString = store.node.nodeLabelFilter.get(`tpopmassnber`)
  if (filterString) {
    nodes = nodes.filter(p =>
      p.label.toLowerCase().includes(filterString.toLowerCase())
    )
  }
  // sort by label and return
  return sortBy(nodes, `label`)
}
