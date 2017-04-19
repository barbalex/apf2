import findIndex from 'lodash/findIndex'

export default (store, tree, projId, apArtId) => {
  // check passed variables
  if (!store) return store.listError(new Error('no store passed'))
  if (!tree) return store.listError(new Error('no tree passed'))
  if (!apArtId) return store.listError(new Error('no apArtId passed'))
  if (!projId) return store.listError(new Error('no projId passed'))

  // fetch sorting indexes of parents
  const projIndex = findIndex(tree.filteredAndSorted.projekt, {
    ProjId: projId
  })
  const apIndex = findIndex(tree.filteredAndSorted.ap, { ApArtId: apArtId })

  // prevent folder from showing when nodeFilter is set
  if (apIndex === -1) return []

  const beobzuordnungNodesLength = tree.filteredAndSorted.beobzuordnung.filter(
    n => n.NO_ISFS === apArtId
  ).length

  let message = beobzuordnungNodesLength
  if (store.loading.includes(`beob_bereitgestellt`)) {
    message = `...`
  }
  if (tree.nodeLabelFilter.get(`beobzuordnung`)) {
    message = `${beobzuordnungNodesLength} gefiltert`
  }

  return [
    {
      nodeType: `folder`,
      menuType: `beobzuordnungFolder`,
      id: apArtId,
      urlLabel: `nicht-beurteilte-Beobachtungen`,
      label: `Beobachtungen nicht beurteilt (${message})`,
      url: [
        `Projekte`,
        projId,
        `Arten`,
        apArtId,
        `nicht-beurteilte-Beobachtungen`
      ],
      sort: [projIndex, 1, apIndex, 8],
      hasChildren: beobzuordnungNodesLength > 0
    }
  ]
}
