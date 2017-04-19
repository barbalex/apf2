import sortBy from 'lodash/sortBy'

export default (store, tree) => {
  const { table } = store
  const { nodeLabelFilter } = tree
  // grab tpopkontr as array and sort them by year
  let tpopkontr = Array.from(table.tpopkontr.values()).filter(
    t => t.TPopKontrTyp !== `Freiwilligen-Erfolgskontrolle`
  )
  // map through all projekt and create array of nodes
  tpopkontr.forEach(el => {
    el.label = `${el.TPopKontrJahr || `(kein Jahr)`}: ${el.TPopKontrTyp || `(kein Typ)`}`
  })
  // filter by nodeLabelFilter
  const filterString = nodeLabelFilter.get(`tpopfeldkontr`)
  if (filterString) {
    tpopkontr = tpopkontr.filter(p =>
      p.label.toLowerCase().includes(filterString.toLowerCase())
    )
  }
  // sort by label and return
  return sortBy(tpopkontr, `label`)
}
