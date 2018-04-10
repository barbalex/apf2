import sortBy from 'lodash/sortBy'

export default (store: Object, tree: Object): Array<Object> => {
  const { table } = store
  const { nodeLabelFilter } = tree

  // grab apberuebersicht as array and sort them by year
  let apberuebersicht = Array.from(table.apberuebersicht.values())

  // filter by nodeLabelFilter
  const filterString = nodeLabelFilter.get('apberuebersicht')
  if (filterString) {
    apberuebersicht = apberuebersicht.filter(p =>
      p.jahr.toString().includes(filterString)
    )
  }

  // sort
  apberuebersicht = sortBy(apberuebersicht, 'jahr')

  return apberuebersicht
}
