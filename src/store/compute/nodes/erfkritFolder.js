import findIndex from 'lodash/findIndex'

export default (store) => {
  const { activeUrlElements, tree } = store

  // fetch sorting indexes of parents
  const projId = activeUrlElements.projekt
  if (!projId) return []
  const projIndex = findIndex(store.tree.filteredAndSorted.projekt, { ProjId: projId })
  const apArtId = activeUrlElements.ap
  if (!apArtId) return []
  const apIndex = findIndex(store.tree.filteredAndSorted.ap, { ApArtId: apArtId })

  const erfkritNodesLength = tree.filteredAndSorted.erfkrit.length

  let message = erfkritNodesLength
  if (store.table.erfkritLoading) {
    message = `...`
  }
  if (tree.nodeLabelFilter.get(`erfkrit`)) {
    message = `${erfkritNodesLength} gefiltert`
  }

  return {
    nodeType: `folder`,
    menuType: `erfkritFolder`,
    id: apArtId,
    label: `AP-Erfolgskriterien (${message})`,
    expanded: activeUrlElements.erfkritFolder,
    url: [`Projekte`, projId, `Arten`, apArtId, `AP-Erfolgskriterien`],
    sort: [projIndex, 1, apIndex, 3],
    hasChildren: erfkritNodesLength > 0,
  }
}
