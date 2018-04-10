import sortBy from 'lodash/sortBy'

export default (store: Object, tree: Object): Array<Object> => {
  const { table } = store
  const { nodeLabelFilter } = tree
  // grab ber as array and sort them by year
  let ber = Array.from(table.ber.values())

  // add label
  ber.forEach(el => {
    el.label = `${el.jahr || '(kein Jahr)'}: ${el.titel || '(kein Titel)'}`
  })
  // filter by nodeLabelFilter
  const filterString = nodeLabelFilter.get('ber')
  if (filterString) {
    ber = ber.filter(p => {
      return p.label.toLowerCase().includes(filterString)
    })
  }
  // sort
  ber = sortBy(ber, 'label')
  return ber
}
