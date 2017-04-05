import findIndex from 'lodash/findIndex'

export default (store, tree) => {
  const { table } = store

  // fetch sorting indexes of parents
  const projId = tree.activeNodes.projekt
  if (!projId) return []
  const projIndex = findIndex(
    tree.filteredAndSorted.projekt,
    { ProjId: projId }
  )
  const apArtId = tree.activeNodes.ap
  if (!apArtId) return []
  const apIndex = findIndex(
    tree.filteredAndSorted.ap,
    { ApArtId: apArtId }
  )
  // prevent folder from showing when nodeFilter is set
  if (apIndex === -1) return []

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
    urlLabel: `AP-Berichte`,
    label: `AP-Berichte (${message})`,
    expanded: tree.activeNodes.apberFolder,
    url: [`Projekte`, projId, `Arten`, apArtId, `AP-Berichte`],
    sort: [projIndex, 1, apIndex, 4],
    hasChildren: apberNodesLength > 0,
  }
}
