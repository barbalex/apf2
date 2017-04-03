import findIndex from 'lodash/findIndex'

export default (store, tree) => {
  const { activeNodes } = tree
  // fetch sorting indexes of parents
  const projId = activeNodes.projekt
  if (!projId) return []
  const projIndex = findIndex(tree.filteredAndSorted.projekt, { ProjId: projId })
  // build label
  const apberuebersichtNodesLength = tree.node.apberuebersicht.length
  let message = apberuebersichtNodesLength
  if (store.table.apberuebersichtLoading) {
    message = `...`
  }
  if (tree.nodeLabelFilter.get(`apberuebersicht`)) {
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
