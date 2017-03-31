import findIndex from 'lodash/findIndex'

export default (store) => {
  const { activeUrlElements, node } = store
  // fetch sorting indexes of parents
  const projId = activeUrlElements.projekt
  if (!projId) return []
  const projIndex = findIndex(store.node.filteredAndSorted.projekt, { ProjId: projId })
  // map through all projekt and create array of nodes
  return node.filteredAndSorted.apberuebersicht.map((el, index) => ({
    nodeType: `table`,
    menuType: `apberuebersicht`,
    id: el.JbuJahr,
    parentId: el.ProjId,
    label: el.JbuJahr,
    expanded: el.JbuJahr === activeUrlElements.apberuebersicht,
    url: [`Projekte`, el.ProjId, `AP-Berichte`, el.JbuJahr],
    sort: [projIndex, 2, el.JbuJahr],
    hasChildren: false,
  }))
}
