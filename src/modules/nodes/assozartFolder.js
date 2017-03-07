import findIndex from 'lodash/findIndex'

export default (store) => {
  const { activeUrlElements, table } = store

  // fetch sorting indexes of parents
  const projId = activeUrlElements.projekt
  if (!projId) return []
  const projIndex = findIndex(store.table.filteredAndSorted.projekt, { ProjId: projId })
  const apArtId = activeUrlElements.ap
  if (!apArtId) return []
  const apIndex = findIndex(store.table.filteredAndSorted.ap, { ApArtId: apArtId })
  const assozartNodesLength = table.filteredAndSorted.assozart.length
  let message = assozartNodesLength
  if (store.table.assozartLoading) {
    message = `...`
  }
  if (store.node.nodeLabelFilter.get(`assozart`)) {
    message = `${assozartNodesLength} gefiltert`
  }
  const sort = [projIndex, 1, apIndex, 9]

  return {
    nodeType: `folder`,
    menuType: `assozartFolder`,
    id: apArtId,
    label: `assoziierte Arten (${message})`,
    expanded: activeUrlElements.assozartFolder,
    url: [`Projekte`, projId, `Arten`, apArtId, `assoziierte-Arten`],
    level: 4,
    sort,
    childrenLength: assozartNodesLength,
  }
}
