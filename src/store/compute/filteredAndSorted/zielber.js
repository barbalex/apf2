import sortBy from 'lodash/sortBy'

export default (store: Object, tree: Object): Array<Object> => {
  const { table } = store
  const { nodeLabelFilter } = tree

  // grab zielbere as array and sort them by year
  let zielbere = Array.from(table.zielber.values())

  // map through all and create array of nodes
  zielbere.forEach(el => {
    el.label = `${el.jahr || '(kein Jahr)'}: ${el.erreichung ||
      '(nicht beurteilt)'}`
  })

  // filter by nodeLabelFilter
  const filterString = nodeLabelFilter.get('zielber')
  if (filterString) {
    zielbere = zielbere.filter(p =>
      p.label.toLowerCase().includes(filterString.toLowerCase())
    )
  }

  // sort by label and return
  return sortBy(zielbere, 'label')
}
