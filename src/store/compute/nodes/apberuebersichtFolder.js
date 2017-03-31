import findIndex from 'lodash/findIndex'

export default (store) => {
  const { activeUrlElements } = store
  // fetch sorting indexes of parents
  const projId = activeUrlElements.projekt
  if (!projId) return []
  const projIndex = findIndex(store.node.filteredAndSorted.projekt, { ProjId: projId })
  // build label
  const apberuebersichtNodesLength = store.node.node.apberuebersicht.length
  let message = apberuebersichtNodesLength
  if (store.table.apberuebersichtLoading) {
    message = `...`
  }
  if (store.node.nodeLabelFilter.get(`apberuebersicht`)) {
    message = `${apberuebersichtNodesLength} gefiltert`
  }

  return {
    menuType: `apberuebersichtFolder`,
    id: projId,
    label: `AP-Berichte (${message})`,
    expanded: activeUrlElements.apberuebersichtFolder,
    url: [`Projekte`, projId, `AP-Berichte`],
    level: 2,
    sort: [projIndex, 2],
    hasChildren: apberuebersichtNodesLength > 0,
  }
}
