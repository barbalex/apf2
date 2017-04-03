import findIndex from 'lodash/findIndex'

export default (store) => {
  const { activeNodes, tree } = store

  // fetch sorting indexes of parents
  const projId = activeNodes.projekt
  if (!projId) return []
  const projIndex = findIndex(store.tree.filteredAndSorted.projekt, { ProjId: projId })
  const apArtId = activeNodes.ap
  if (!apArtId) return []
  const apIndex = findIndex(store.tree.filteredAndSorted.ap, { ApArtId: apArtId })

  const assozartNodesLength = tree.filteredAndSorted.assozart.length
  let message = assozartNodesLength
  if (store.table.assozartLoading) {
    message = `...`
  }
  if (store.tree.nodeLabelFilter.get(`assozart`)) {
    message = `${assozartNodesLength} gefiltert`
  }

  return {
    nodeType: `folder`,
    menuType: `assozartFolder`,
    id: apArtId,
    label: `assoziierte Arten (${message})`,
    expanded: activeNodes.assozartFolder,
    url: [`Projekte`, projId, `Arten`, apArtId, `assoziierte-Arten`],
    sort: [projIndex, 1, apIndex, 7],
    hasChildren: assozartNodesLength > 0,
  }
}
