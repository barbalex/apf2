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

  return tree.filteredAndSorted.assozart
    .filter(p => p.AaApArtId === apArtId)
    .map((el, index) => ({
      nodeType: `table`,
      menuType: `assozart`,
      id: el.AaId,
      parentId: apArtId,
      urlLabel: el.AaId,
      label: el.label,
      url: [`Projekte`, projId, `Arten`, apArtId, `assoziierte-Arten`, el.AaId],
      sort: [projIndex, 1, apIndex, 7, index],
      hasChildren: false
    }))
}
