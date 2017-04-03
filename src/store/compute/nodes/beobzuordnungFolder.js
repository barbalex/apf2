import findIndex from 'lodash/findIndex'

export default (store, tree) => {
  // fetch sorting indexes of parents
  const projId = tree.activeNodes.projekt
  if (!projId) return []
  const projIndex = findIndex(tree.filteredAndSorted.projekt, { ProjId: projId })
  const apArtId = tree.activeNodes.ap
  if (!apArtId) return []
  const apIndex = findIndex(tree.filteredAndSorted.ap, { ApArtId: apArtId })

  const beobzuordnungNodesLength = tree.filteredAndSorted.beobzuordnung.length

  let message = beobzuordnungNodesLength
  if (store.loading.includes(`beob_bereitgestellt`)) {
    message = `...`
  }
  if (tree.nodeLabelFilter.get(`beobzuordnung`)) {
    message = `${beobzuordnungNodesLength} gefiltert`
  }

  return {
    nodeType: `folder`,
    menuType: `beobzuordnungFolder`,
    id: apArtId,
    label: `Beobachtungen nicht beurteilt (${message})`,
    expanded: tree.activeNodes.beobzuordnungFolder,
    url: [`Projekte`, projId, `Arten`, apArtId, `nicht-beurteilte-Beobachtungen`],
    sort: [projIndex, 1, apIndex, 8],
    hasChildren: beobzuordnungNodesLength > 0,
  }
}
