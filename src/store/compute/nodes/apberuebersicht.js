import findIndex from 'lodash/findIndex'

export default (store) => {
  const { activeNodes, tree } = store
  // fetch sorting indexes of parents
  const projId = activeNodes.projekt
  if (!projId) return []
  const projIndex = findIndex(store.tree.filteredAndSorted.projekt, { ProjId: projId })
  // map through all projekt and create array of nodes
  return tree.filteredAndSorted.apberuebersicht.map((el, index) => ({
    nodeType: `table`,
    menuType: `apberuebersicht`,
    id: el.JbuJahr,
    parentId: el.ProjId,
    label: el.JbuJahr,
    expanded: el.JbuJahr === activeNodes.apberuebersicht,
    url: [`Projekte`, el.ProjId, `AP-Berichte`, el.JbuJahr],
    sort: [projIndex, 2, el.JbuJahr],
    hasChildren: false,
  }))
}
