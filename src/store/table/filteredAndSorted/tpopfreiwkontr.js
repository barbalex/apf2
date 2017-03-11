import sortBy from 'lodash/sortBy'

export default (store) => {
  const { activeUrlElements, table, node } = this
  // grab tpopkontr as array and sort them by year
  let tpopkontr = Array.from(table.tpopkontr.values())
    .filter(t => t.TPopKontrTyp === `Freiwilligen-Erfolgskontrolle`)
  // show only nodes of active ap
  tpopkontr = tpopkontr.filter(a => a.TPopId === activeUrlElements.tpop)
  // add label
  tpopkontr.forEach((el) => {
    el.label = `${el.TPopKontrJahr || `(kein Jahr)`}`
  })
  // filter by node.nodeLabelFilter
  const filterString = node.nodeLabelFilter.get(`tpopfreiwkontr`)
  if (filterString) {
    tpopkontr = tpopkontr.filter(p =>
      p.label.toLowerCase().includes(filterString.toLowerCase())
    )
  }
  // sort by label and return
  return sortBy(tpopkontr, `label`)
}
