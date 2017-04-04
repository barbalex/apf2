import findIndex from 'lodash/findIndex'

export default (store, tree) => {
  // fetch sorting indexes of parents
  const projId = tree.activeNodes.projekt
  if (!projId) return []
  const projIndex = findIndex(tree.filteredAndSorted.projekt, { ProjId: projId })
  const apArtId = tree.activeNodes.ap
  if (!apArtId) return []
  const apIndex = findIndex(tree.filteredAndSorted.ap, { ApArtId: apArtId })
  // prevent folder from showing when nodeFilter is set
  if (apIndex === -1) return []

  const assozartNodesLength = tree.filteredAndSorted.assozart.length
  let message = assozartNodesLength
  if (store.table.assozartLoading) {
    message = `...`
  }
  if (tree.nodeLabelFilter.get(`assozart`)) {
    message = `${assozartNodesLength} gefiltert`
  }

  return {
    nodeType: `folder`,
    menuType: `assozartFolder`,
    id: apArtId,
    label: `assoziierte Arten (${message})`,
    expanded: tree.activeNodes.assozartFolder,
    url: [`Projekte`, projId, `Arten`, apArtId, `assoziierte-Arten`],
    sort: [projIndex, 1, apIndex, 7],
    hasChildren: assozartNodesLength > 0,
  }
}
