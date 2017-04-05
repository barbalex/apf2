import findIndex from 'lodash/findIndex'

export default (store, tree) => {
  const { table } = store
  const { activeNodes } = tree

  // fetch sorting indexes of parents
  const projId = activeNodes.projekt
  if (!projId) return []
  const projIndex = findIndex(tree.filteredAndSorted.projekt, { ProjId: projId })
  const apArtId = activeNodes.ap
  if (!apArtId) return []
  const apIndex = findIndex(tree.filteredAndSorted.ap, { ApArtId: apArtId })
  // prevent folder from showing when nodeFilter is set
  if (apIndex === -1) return []

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
    urlLabel: `Populationen`,
    label: `Populationen (${message})`,
    expanded: activeNodes.popFolder,
    url: [`Projekte`, projId, `Arten`, apArtId, `Populationen`],
    sort: [projIndex, 1, apIndex, 1],
    hasChildren: popNodesLength > 0,
  }
}
