import sortBy from 'lodash/sortBy'

export default (store) => {
  const { activeUrlElements, table, tree } = store
  // grab tpopmassn as array and sort them by year
  let tpopmassn = Array.from(table.tpopmassn.values())
  // show only nodes of active ap
  tpopmassn = tpopmassn.filter(a => a.TPopId === activeUrlElements.tpop)
  // get erfkritWerte
  const tpopmassntypWerte = Array.from(table.tpopmassn_typ_werte.values())
  // map through all projekt and create array of nodes
  tpopmassn.forEach((el) => {
    const tpopmassntypWert = tpopmassntypWerte.find(e => e.MassnTypCode === el.TPopMassnTyp)
    const massnTypTxt = tpopmassntypWert ? tpopmassntypWert.MassnTypTxt : null
    el.label = `${el.TPopMassnJahr || `(kein Jahr)`}: ${massnTypTxt || `(kein Typ)`}`
  })
  // filter by tree.nodeLabelFilter
  const filterString = tree.nodeLabelFilter.get(`tpopmassn`)
  if (filterString) {
    tpopmassn = tpopmassn.filter(p =>
      p.label.toLowerCase().includes(filterString.toLowerCase())
    )
  }
  // sort by label and return
  return sortBy(tpopmassn, `label`)
}
