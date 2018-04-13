import sortBy from 'lodash/sortBy'

export default (store: Object, tree: Object): Array<Object> => {
  const { table } = store
  const { nodeLabelFilter } = tree
  // grab tpop as array and sort them by year
  let tpop = Array.from(table.tpop.values())
  tpop = sortBy(tpop, 'nr')
  tpop.forEach(el => {
    el.label = `${el.nr || '(keine Nr)'}: ${el.TPopFlurname ||
      '(kein Flurname)'}`
  })
  // filter by nodeLabelFilter
  const filterString = nodeLabelFilter.get('tpop')
  if (filterString) {
    tpop = tpop.filter(p =>
      p.label.toLowerCase().includes(filterString.toLowerCase())
    )
  }
  return tpop
}
