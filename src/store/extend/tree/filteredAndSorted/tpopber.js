import sortBy from 'lodash/sortBy'

export default (store) => {
  const { table, tree } = store
  const { activeNodes, nodeLabelFilter } = tree
  // grab tpopber as array and sort them by year
  let tpopber = Array.from(table.tpopber.values())
  // show only nodes of active ap
  tpopber = tpopber.filter(a => a.TPopId === activeNodes.tpop)
  // get entwicklungWerte
  const tpopEntwicklungWerte = Array.from(table.tpop_entwicklung_werte.values())
  // map through all projekt and create array of nodes
  tpopber.forEach((el) => {
    const tpopEntwicklungWert = tpopEntwicklungWerte.find(e => e.EntwicklungCode === el.TPopBerEntwicklung)
    const entwicklungTxt = tpopEntwicklungWert ? tpopEntwicklungWert.EntwicklungTxt : null
    el.label = `${el.TPopBerJahr || `(kein Jahr)`}: ${entwicklungTxt || `(nicht beurteilt)`}`
  })
  // filter by nodeLabelFilter
  const filterString = nodeLabelFilter.get(`tpopber`)
  if (filterString) {
    tpopber = tpopber.filter(p =>
      p.label.toLowerCase().includes(filterString.toLowerCase())
    )
  }
  // sort by label and return
  return sortBy(tpopber, `label`)
}
