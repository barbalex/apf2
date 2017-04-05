import findIndex from 'lodash/findIndex'

export default (store, tree) => {
  // fetch sorting indexes of parents
  const projId = tree.activeNodes.projekt
  if (!projId) return []
  const projIndex = findIndex(tree.filteredAndSorted.projekt, { ProjId: projId })
  // build label
  const apNodesLength = tree.filteredAndSorted.ap.length
  let message = apNodesLength
  if (store.table.apLoading) {
    message = `...`
  }
  if (tree.nodeLabelFilter.get(`ap`)) {
    message = `${apNodesLength} gefiltert`
  }

  return {
    nodeType: `folder`,
    menuType: `apFolder`,
    id: projId,
    urlLabel: `Arten`,
    label: `Arten (${message})`,
    expanded: tree.activeNodes.apFolder,
    url: [`Projekte`, projId, `Arten`],
    sort: [projIndex, 1],
    hasChildren: apNodesLength > 0,
  }
}
