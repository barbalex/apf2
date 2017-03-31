import findIndex from 'lodash/findIndex'

export default (store) => {
  const { activeUrlElements, node, table } = store

  // fetch sorting indexes of parents
  const projId = activeUrlElements.projekt
  if (!projId) return []
  const projIndex = findIndex(node.filteredAndSorted.projekt, { ProjId: projId })
  const apArtId = activeUrlElements.ap
  if (!apArtId) return []
  const apIndex = findIndex(node.filteredAndSorted.ap, { ApArtId: apArtId })

  const popNodesLength = node.filteredAndSorted.pop.length
  let message = popNodesLength
  if (table.popLoading) {
    message = `...`
  }
  if (node.nodeLabelFilter.get(`pop`)) {
    message = `${popNodesLength} gefiltert`
  }

  return {
    nodeType: `folder`,
    menuType: `popFolder`,
    id: apArtId,
    label: `Populationen (${message})`,
    expanded: activeUrlElements.popFolder,
    url: [`Projekte`, projId, `Arten`, apArtId, `Populationen`],
    level: 4,
    sort: [projIndex, 1, apIndex, 1],
    hasChildren: popNodesLength > 0,
  }
}
