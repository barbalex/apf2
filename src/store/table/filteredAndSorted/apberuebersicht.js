import sortBy from 'lodash/sortBy'

export default (store) => {
  const { activeUrlElements, table, node } = store
  // grab apberuebersicht as array and sort them by year
  let apberuebersicht = Array.from(table.apberuebersicht.values())
  // show only nodes of active projekt
  apberuebersicht = apberuebersicht.filter(a => a.ProjId === activeUrlElements.projekt)
  // filter by node.nodeLabelFilter
  const filterString = node.nodeLabelFilter.get(`apberuebersicht`)
  if (filterString) {
    apberuebersicht = apberuebersicht.filter(p =>
      p.JbuJahr
        .toString()
        .includes(filterString)
    )
  }
  // sort
  apberuebersicht = sortBy(apberuebersicht, `JbuJahr`)
  return apberuebersicht
}
