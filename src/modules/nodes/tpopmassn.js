import sortBy from 'lodash/sortBy'

export default ({ store, projId, apArtId, popId, tpopId }) => {
  const { activeUrlElements } = store
  // grab tpopmassn as array and sort them by year
  let tpopmassn = Array.from(store.table.tpopmassn.values())
  // show only nodes of active ap
  tpopmassn = tpopmassn.filter(a => a.TPopId === tpopId)
  // get erfkritWerte
  const tpopmassntypWerte = Array.from(store.table.tpopmassn_typ_werte.values())
  // map through all projekt and create array of nodes
  let nodes = tpopmassn.map((el) => {
    const tpopmassntypWert = tpopmassntypWerte.find(e => e.MassnTypCode === el.TPopMassnTyp)
    const massnTypTxt = tpopmassntypWert ? tpopmassntypWert.MassnTypTxt : null
    return {
      nodeType: `table`,
      menuType: `tpopmassn`,
      id: el.TPopMassnId,
      parentId: tpopId,
      label: `${el.TPopMassnJahr || `(kein Jahr)`}: ${massnTypTxt || `(kein Typ)`}`,
      expanded: el.TPopMassnId === activeUrlElements.tpopmassn,
      url: [`Projekte`, projId, `Arten`, apArtId, `Populationen`, popId, `Teil-Populationen`, tpopId, `Massnahmen`, el.TPopMassnId],
    }
  })
  // filter by node.nodeLabelFilter
  const filterString = store.node.nodeLabelFilter.get(`tpopmassn`)
  if (filterString) {
    nodes = nodes.filter(p =>
      p.label.toLowerCase().includes(filterString.toLowerCase())
    )
  }
  // sort by label and return
  return sortBy(nodes, `label`)
}
