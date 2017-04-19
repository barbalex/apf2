import findIndex from 'lodash/findIndex'

export default (store, tree, projId, apArtId) => {
  // check passed variables
  if (!store) return store.listError(new Error('no store passed'))
  if (!tree) return store.listError(new Error('no tree passed'))
  if (!apArtId) return store.listError(new Error('no apArtId passed'))
  if (!projId) return store.listError(new Error('no projId passed'))

  const { table } = store

  // fetch sorting indexes of parents
  const projIndex = findIndex(tree.filteredAndSorted.projekt, {
    ProjId: projId
  })
  const apIndex = findIndex(tree.filteredAndSorted.ap, { ApArtId: apArtId })

  // prevent folder from showing when nodeFilter is set
  if (apIndex === -1) return []

  const apberNodesLength = tree.filteredAndSorted.apber.filter(
    n => n.ApArtId === apArtId
  ).length

  let message = apberNodesLength
  if (table.apberLoading) {
    message = `...`
  }
  if (tree.nodeLabelFilter.get(`apber`)) {
    message = `${apberNodesLength} gefiltert`
  }

  return [
    {
      nodeType: `folder`,
      menuType: `apberFolder`,
      id: apArtId,
      urlLabel: `AP-Berichte`,
      label: `AP-Berichte (${message})`,
      url: [`Projekte`, projId, `Arten`, apArtId, `AP-Berichte`],
      sort: [projIndex, 1, apIndex, 4],
      hasChildren: apberNodesLength > 0
    }
  ]
}
