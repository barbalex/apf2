import findIndex from 'lodash/findIndex'

export default (store) => {
  const { table, tree } = store

  // fetch sorting indexes of parents
  const projId = tree.activeNodes.projekt
  if (!projId) return []
  const projIndex = findIndex(
    store.tree.filteredAndSorted.projekt,
    { ProjId: projId }
  )
  const apArtId = tree.activeNodes.ap
  if (!apArtId) return []
  const apIndex = findIndex(
    store.tree.filteredAndSorted.ap,
    { ApArtId: apArtId }
  )

  const apberNodesLength = tree.filteredAndSorted.apber.length

  let message = apberNodesLength
  if (table.apberLoading) {
    message = `...`
  }
  if (tree.nodeLabelFilter.get(`apber`)) {
    message = `${apberNodesLength} gefiltert`
  }

  return {
    nodeType: `folder`,
    menuType: `apberFolder`,
    id: apArtId,
    label: `AP-Berichte (${message})`,
    expanded: tree.activeNodes.apberFolder,
    url: [`Projekte`, projId, `Arten`, apArtId, `AP-Berichte`],
    sort: [projIndex, 1, apIndex, 4],
    hasChildren: apberNodesLength > 0,
  }
}
