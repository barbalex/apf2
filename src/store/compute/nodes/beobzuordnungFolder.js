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

  const beobzuordnungNodesLength = node.filteredAndSorted.beobzuordnung.length

  let message = beobzuordnungNodesLength
  if (store.loading.includes(`beob_bereitgestellt`)) {
    message = `...`
  }
  if (store.node.nodeLabelFilter.get(`beobzuordnung`)) {
    message = `${beobzuordnungNodesLength} gefiltert`
  }

  return {
    nodeType: `folder`,
    menuType: `beobzuordnungFolder`,
    id: apArtId,
    label: `Beobachtungen nicht beurteilt (${message})`,
    expanded: activeUrlElements.beobzuordnungFolder,
    url: [`Projekte`, projId, `Arten`, apArtId, `nicht-beurteilte-Beobachtungen`],
    level: 4,
    sort: [projIndex, 1, apIndex, 8],
    hasChildren: beobzuordnungNodesLength > 0,
  }
}
