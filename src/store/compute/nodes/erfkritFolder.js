import findIndex from 'lodash/findIndex'

export default (store, tree) => {
  // fetch sorting indexes of parents
  const projId = tree.activeNodes.projekt
  if (!projId) return []
  const projIndex = findIndex(tree.filteredAndSorted.projekt, { ProjId: projId })
  const apArtId = tree.activeNodes.ap
  if (!apArtId) return []
  const apIndex = findIndex(tree.filteredAndSorted.ap, { ApArtId: apArtId })

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
    expanded: tree.activeNodes.erfkritFolder,
    url: [`Projekte`, projId, `Arten`, apArtId, `AP-Erfolgskriterien`],
    sort: [projIndex, 1, apIndex, 3],
    hasChildren: erfkritNodesLength > 0,
  }
}
