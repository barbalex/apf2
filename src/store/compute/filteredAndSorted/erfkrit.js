import sortBy from 'lodash/sortBy'

export default (store: Object, tree: Object): Object => {
  const { table } = store
  const { nodeLabelFilter } = tree
  // grab erfkrit as array and sort them by year
  let erfkrit = Array.from(table.erfkrit.values())

  // get erfkritWerte
  const apErfkritWerte = Array.from(table.ap_erfkrit_werte.values())
  erfkrit.forEach((el, index) => {
    const erfkritWert = apErfkritWerte.find(
      e => e.BeurteilId === el.ErfkritErreichungsgrad,
    )
    const beurteilTxt = erfkritWert ? erfkritWert.BeurteilTxt : null
    el.sort = erfkritWert ? erfkritWert.BeurteilOrd : null
    el.label = `${beurteilTxt || '(nicht beurteilt)'}: ${el.ErfkritTxt || '(keine Kriterien erfasst)'}`
  })
  // filter by nodeLabelFilter
  const filterString = nodeLabelFilter.get('erfkrit')
  if (filterString) {
    erfkrit = erfkrit.filter(p =>
      p.label.toLowerCase().includes(filterString.toLowerCase()),
    )
  }
  // sort by label and return
  erfkrit = sortBy(erfkrit, 'sort')
  return erfkrit
}
