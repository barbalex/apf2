import sortBy from 'lodash/sortBy'

export default (store: Object, tree: Object): Array<Object> => {
  const { table } = store
  const { nodeLabelFilter } = tree
  // grab pop as array and sort them by year
  let pop = Array.from(table.pop.values())

  pop = sortBy(pop, 'nr')
  // map through all projekt and create array of nodes
  pop.forEach(el => {
    el.label = `${el.nr || '(keine Nr)'}: ${el.PopName || '(kein Name)'}`
  })
  // filter by nodeLabelFilter
  const filterString = nodeLabelFilter.get('pop')
  if (filterString) {
    pop = pop.filter(p =>
      p.label.toLowerCase().includes(filterString.toLowerCase())
    )
  }
  return pop
}
