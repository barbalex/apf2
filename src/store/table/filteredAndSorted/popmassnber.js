import sortBy from 'lodash/sortBy'

export default (store) => {
  const { activeUrlElements, table, node } = this
  // grab popmassnber as array and sort them by year
  let popmassnber = Array.from(table.popmassnber.values())
  // show only nodes of active pop
  popmassnber = popmassnber.filter(a => a.PopId === activeUrlElements.pop)
  // get erfkritWerte
  const tpopmassnErfbeurtWerte = Array.from(table.tpopmassn_erfbeurt_werte.values())
  // map through all projekt and create array of nodes
  popmassnber.forEach((el) => {
    const tpopmassnErfbeurtWert = tpopmassnErfbeurtWerte.find(e => e.BeurteilId === el.PopMassnBerErfolgsbeurteilung)
    const beurteilTxt = tpopmassnErfbeurtWert ? tpopmassnErfbeurtWert.BeurteilTxt : null
    el.label = `${el.PopMassnBerJahr || `(kein Jahr)`}: ${beurteilTxt || `(nicht beurteilt)`}`
  })
  // filter by node.nodeLabelFilter
  const filterString = node.nodeLabelFilter.get(`popmassnber`)
  if (filterString) {
    popmassnber = popmassnber.filter(p =>
      p.label.toLowerCase().includes(filterString.toLowerCase())
    )
  }
  // sort by label and return
  return sortBy(popmassnber, `label`)
}
