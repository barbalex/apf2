import sortBy from 'lodash/sortBy'

export default (store) => {
  const { activeNodes, table, tree } = store
  // grab pop as array and sort them by year
  let pop = Array.from(table.pop.values())
  // show only nodes of active ap
  pop = pop.filter(a => a.ApArtId === activeNodes.ap)
  pop = sortBy(pop, `PopNr`)
  // map through all projekt and create array of nodes
  pop.forEach((el) => {
    el.label = `${el.PopNr || `(keine Nr)`}: ${el.PopName || `(kein Name)`}`
  })
  // filter by tree.nodeLabelFilter
  const filterString = tree.nodeLabelFilter.get(`pop`)
  if (filterString) {
    pop = pop.filter(p =>
      p.label.toLowerCase().includes(filterString.toLowerCase())
    )
  }
  return pop
}
