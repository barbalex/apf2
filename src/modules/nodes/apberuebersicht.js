import findIndex from 'lodash/findIndex'

export default (store) => {
  const { activeUrlElements, table } = store
  // fetch sorting indexes of parents
  const projId = activeUrlElements.projekt
  if (!projId) return []
  const projIndex = findIndex(store.table.filteredAndSorted.projekt, { ProjId: projId })
  // map through all projekt and create array of nodes
  return table.filteredAndSorted.apberuebersicht.map((el, index) => {
    const sort = [projIndex, 2, el.JbuJahr]
    return {
      nodeType: `table`,
      menuType: `apberuebersicht`,
      id: el.JbuJahr,
      parentId: el.ProjId,
      label: el.JbuJahr,
      expanded: el.JbuJahr === activeUrlElements.apberuebersicht,
      url: [`Projekte`, el.ProjId, `AP-Berichte`, el.JbuJahr],
      level: 3,
      sort,
      childrenLength: 0,
    }
  })
}
