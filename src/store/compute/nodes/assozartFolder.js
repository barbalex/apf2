import findIndex from 'lodash/findIndex'

export default (store) => {
  const { activeUrlElements, node } = store

  // fetch sorting indexes of parents
  const projId = activeUrlElements.projekt
  if (!projId) return []
  const projIndex = findIndex(store.node.filteredAndSorted.projekt, { ProjId: projId })
  const apArtId = activeUrlElements.ap
  if (!apArtId) return []
  const apIndex = findIndex(store.node.filteredAndSorted.ap, { ApArtId: apArtId })

  const assozartNodesLength = node.filteredAndSorted.assozart.length
  let message = assozartNodesLength
  if (store.table.assozartLoading) {
    message = `...`
  }
  if (store.node.nodeLabelFilter.get(`assozart`)) {
    message = `${assozartNodesLength} gefiltert`
  }

  return {
    nodeType: `folder`,
    menuType: `assozartFolder`,
    id: apArtId,
    label: `assoziierte Arten (${message})`,
    expanded: activeUrlElements.assozartFolder,
    url: [`Projekte`, projId, `Arten`, apArtId, `assoziierte-Arten`],
    level: 4,
    sort: [projIndex, 1, apIndex, 7],
    hasChildren: assozartNodesLength > 0,
  }
}
