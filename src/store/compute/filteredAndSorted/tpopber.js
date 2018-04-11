import sortBy from 'lodash/sortBy'

export default (store: Object, tree: Object): Array<Object> => {
  const { table } = store
  const { nodeLabelFilter } = tree
  // grab tpopber as array and sort them by year
  let tpopber = Array.from(table.tpopber.values())
  // get entwicklungWerte
  const tpopEntwicklungWerte = Array.from(table.tpop_entwicklung_werte.values())
  // map through all projekt and create array of nodes
  tpopber.forEach(el => {
    const tpopEntwicklungWert = tpopEntwicklungWerte.find(
      e => e.code === el.entwicklung
    )
    const entwicklungTxt = tpopEntwicklungWert ? tpopEntwicklungWert.text : null
    el.label = `${el.jahr || '(kein Jahr)'}: ${entwicklungTxt ||
      '(nicht beurteilt)'}`
  })
  // filter by nodeLabelFilter
  const filterString = nodeLabelFilter.get('tpopber')
  if (filterString) {
    tpopber = tpopber.filter(p =>
      p.label.toLowerCase().includes(filterString.toLowerCase())
    )
  }
  // sort by label and return
  return sortBy(tpopber, 'label')
}
