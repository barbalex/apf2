import sortBy from 'lodash/sortBy'

export default (store, projId) => {
  const { activeUrlElements } = store
  // grab apberuebersicht as array and sort them by year
  let apberuebersicht = Array.from(store.table.apberuebersicht.values())
  // show only nodes of active projekt
  apberuebersicht = apberuebersicht.filter(a => a.ProjId === projId)
  // filter by node.nodeLabelFilter
  const filterString = store.node.nodeLabelFilter.get(`apberuebersicht`)
  if (filterString) {
    apberuebersicht = apberuebersicht.filter(p =>
      p.JbuJahr
        .toString()
        .includes(filterString)
    )
  }
  // sort
  apberuebersicht = sortBy(apberuebersicht, `JbuJahr`)
  // map through all projekt and create array of nodes
  return apberuebersicht.map(el => ({
    nodeType: `table`,
    menuType: `apberuebersicht`,
    id: el.JbuJahr,
    parentId: el.ProjId,
    label: el.JbuJahr,
    expanded: el.JbuJahr === activeUrlElements.apberuebersicht,
    url: [`Projekte`, el.ProjId, `AP-Berichte`, el.JbuJahr],
  }))
}
