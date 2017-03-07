import findIndex from 'lodash/findIndex'

export default (store) => {
  const { activeUrlElements, table } = store
  // fetch sorting indexes of parents
  const projId = activeUrlElements.projekt
  if (!projId) return []
  const projIndex = findIndex(store.table.filteredAndSorted.projekt, { ProjId: projId })
  // build label
  const apNodesLength = table.filteredAndSorted.ap.length
  let message = apNodesLength
  if (store.table.apLoading) {
    message = `...`
  }
  if (store.node.nodeLabelFilter.get(`ap`)) {
    message = `${apNodesLength} gefiltert`
  }

  return {
    nodeType: `folder`,
    menuType: `apFolder`,
    id: projId,
    label: `Arten (${message})`,
    expanded: activeUrlElements.apFolder,
    url: [`Projekte`, projId, `Arten`],
    level: 2,
    sort: [projIndex, 1],
    childrenLength: apNodesLength,
  }
}
