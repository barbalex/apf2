import sortBy from 'lodash/sortBy'

export default (store, tree) => {
  const { table } = store
  const { nodeLabelFilter } = tree
  // grab popber as array and sort them by year
  let popber = Array.from(table.popber.values())
  // get erfkritWerte
  const popEntwicklungWerte = Array.from(table.pop_entwicklung_werte.values())
  // map through all projekt and create array of nodes
  popber.forEach(el => {
    const popEntwicklungWert = popEntwicklungWerte.find(
      e => e.EntwicklungId === el.PopBerEntwicklung
    )
    const entwicklungTxt = popEntwicklungWert
      ? popEntwicklungWert.EntwicklungTxt
      : null
    el.label = `${el.PopBerJahr || `(kein Jahr)`}: ${entwicklungTxt || `(nicht beurteilt)`}`
  })
  // filter by nodeLabelFilter
  const filterString = nodeLabelFilter.get(`popber`)
  if (filterString) {
    popber = popber.filter(p =>
      p.label.toLowerCase().includes(filterString.toLowerCase())
    )
  }
  // sort by label and return
  return sortBy(popber, `label`)
}
