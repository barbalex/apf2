import sortBy from 'lodash/sortBy'

export default (store) => {
  const { table, tree } = store
  const { activeNodes, nodeLabelFilter } = tree
  // grab apberuebersicht as array and sort them by year
  let apberuebersicht = Array.from(table.apberuebersicht.values())
  // show only nodes of active projekt
  apberuebersicht = apberuebersicht.filter(a => a.ProjId === activeNodes.projekt)
  // filter by nodeLabelFilter
  const filterString = nodeLabelFilter.get(`apberuebersicht`)
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
