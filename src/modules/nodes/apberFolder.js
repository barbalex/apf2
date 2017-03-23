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

  const apberNodesLength = table.filteredAndSorted.apber.length

  let message = apberNodesLength
  if (table.apberLoading) {
    message = `...`
  }
  if (node.nodeLabelFilter.get(`apber`)) {
    message = `${apberNodesLength} gefiltert`
  }

  return {
    nodeType: `folder`,
    menuType: `apberFolder`,
    id: apArtId,
    label: `AP-Berichte (${message})`,
    expanded: activeUrlElements.apberFolder,
    url: [`Projekte`, projId, `Arten`, apArtId, `AP-Berichte`],
    level: 4,
    sort: [projIndex, 1, apIndex, 4],
    childrenLength: apberNodesLength,
  }
}
