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

  // map through all projekt and create array of nodes
  return tree.filteredAndSorted.ber
    .filter(p => p.ApArtId === apArtId)
    .map((el, index) => ({
      nodeType: `table`,
      menuType: `ber`,
      id: el.BerId,
      parentId: el.ApArtId,
      urlLabel: el.BerId,
      label: el.label,
      url: [`Projekte`, projId, `Arten`, el.ApArtId, `Berichte`, el.BerId],
      sort: [projIndex, 1, apIndex, 5, index],
      hasChildren: false
    }))
}
