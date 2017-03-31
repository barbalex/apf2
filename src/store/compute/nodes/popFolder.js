import findIndex from 'lodash/findIndex'

export default (store) => {
  const { activeUrlElements, tree, table } = store

  // fetch sorting indexes of parents
  const projId = activeUrlElements.projekt
  if (!projId) return []
  const projIndex = findIndex(tree.filteredAndSorted.projekt, { ProjId: projId })
  const apArtId = activeUrlElements.ap
  if (!apArtId) return []
  const apIndex = findIndex(tree.filteredAndSorted.ap, { ApArtId: apArtId })

  const popNodesLength = tree.filteredAndSorted.pop.length
  let message = popNodesLength
  if (table.popLoading) {
    message = `...`
  }
  if (tree.nodeLabelFilter.get(`pop`)) {
    message = `${popNodesLength} gefiltert`
  }

  return {
    nodeType: `folder`,
    menuType: `popFolder`,
    id: apArtId,
    label: `Populationen (${message})`,
    expanded: activeUrlElements.popFolder,
    url: [`Projekte`, projId, `Arten`, apArtId, `Populationen`],
    sort: [projIndex, 1, apIndex, 1],
    hasChildren: popNodesLength > 0,
  }
}
