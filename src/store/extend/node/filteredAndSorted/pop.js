import sortBy from 'lodash/sortBy'

export default (store) => {
  const { activeUrlElements, table, node } = store
  // grab pop as array and sort them by year
  let pop = Array.from(table.pop.values())
  // show only nodes of active ap
  pop = pop.filter(a => a.ApArtId === activeUrlElements.ap)
  pop = sortBy(pop, `PopNr`)
  // map through all projekt and create array of nodes
  pop.forEach((el) => {
    el.label = `${el.PopNr || `(keine Nr)`}: ${el.PopName || `(kein Name)`}`
  })
  // filter by node.nodeLabelFilter
  const filterString = node.nodeLabelFilter.get(`pop`)
  if (filterString) {
    pop = pop.filter(p =>
      p.label.toLowerCase().includes(filterString.toLowerCase())
    )
  }
  return pop
}
