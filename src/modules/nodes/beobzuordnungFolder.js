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

  const beobzuordnungNodesLength = table.filteredAndSorted.beobzuordnung.length

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
    childrenLength: beobzuordnungNodesLength,
  }
}
