import findIndex from 'lodash/findIndex'

export default (store) => {
  const { activeUrlElements, table, node } = store

  // fetch sorting indexes of parents
  const projId = activeUrlElements.projekt
  if (!projId) return []
  const projIndex = findIndex(store.table.filteredAndSorted.projekt, { ProjId: projId })
  const apArtId = activeUrlElements.ap
  if (!apArtId) return []
  const apIndex = findIndex(store.table.filteredAndSorted.ap, { ApArtId: apArtId })

  const erfkritNodesLength = table.filteredAndSorted.erfkrit.length

  let message = erfkritNodesLength
  if (store.table.erfkritLoading) {
    message = `...`
  }
  if (node.nodeLabelFilter.get(`erfkrit`)) {
    message = `${erfkritNodesLength} gefiltert`
  }

  return {
    nodeType: `folder`,
    menuType: `erfkritFolder`,
    id: apArtId,
    label: `AP-Erfolgskriterien (${message})`,
    expanded: activeUrlElements.erfkritFolder,
    url: [`Projekte`, projId, `Arten`, apArtId, `AP-Erfolgskriterien`],
    level: 4,
    sort: [projIndex, 1, apIndex, 3],
    childrenLength: erfkritNodesLength,
  }
}
