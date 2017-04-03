import findIndex from 'lodash/findIndex'

export default (store) => {
  const { activeNodes } = store
  // fetch sorting indexes of parents
  const projId = activeNodes.projekt
  if (!projId) return []
  const projIndex = findIndex(store.tree.filteredAndSorted.projekt, { ProjId: projId })
  // build label
  const apberuebersichtNodesLength = store.tree.node.apberuebersicht.length
  let message = apberuebersichtNodesLength
  if (store.table.apberuebersichtLoading) {
    message = `...`
  }
  if (store.tree.nodeLabelFilter.get(`apberuebersicht`)) {
    message = `${apberuebersichtNodesLength} gefiltert`
  }

  return {
    menuType: `apberuebersichtFolder`,
    id: projId,
    label: `AP-Berichte (${message})`,
    expanded: activeNodes.apberuebersichtFolder,
    url: [`Projekte`, projId, `AP-Berichte`],
    sort: [projIndex, 2],
    hasChildren: apberuebersichtNodesLength > 0,
  }
}
