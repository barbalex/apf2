import findIndex from 'lodash/findIndex'

export default (
  store: Object,
  tree: Object,
  projId: number,
  apArtId: number,
  popId: number
): Array<Object> => {
  // check passed variables
  if (!store) return store.listError(new Error('no store passed'))
  if (!tree) return store.listError(new Error('no tree passed'))
  if (!projId) return store.listError(new Error('no projId passed'))
  if (!apArtId) return store.listError(new Error('no apArtId passed'))
  if (!popId) return store.listError(new Error('no popId passed'))

  // fetch sorting indexes of parents
  const projIndex = findIndex(tree.filteredAndSorted.projekt, {
    ProjId: projId
  })
  const apIndex = findIndex(
    tree.filteredAndSorted.ap.filter(a => a.ProjId === projId),
    { ApArtId: apArtId }
  )
  const popIndex = findIndex(
    tree.filteredAndSorted.pop.filter(p => p.ApArtId === apArtId),
    { PopId: popId }
  )

  return tree.filteredAndSorted.popber
    .filter(p => p.PopId === popId)
    .map((el, index) => ({
      nodeType: `table`,
      menuType: `popber`,
      id: el.PopBerId,
      parentId: popId,
      urlLabel: el.PopBerId,
      label: el.label,
      url: [
        `Projekte`,
        projId,
        `Arten`,
        apArtId,
        `Populationen`,
        popId,
        `Kontroll-Berichte`,
        el.PopBerId
      ],
      sort: [projIndex, 1, apIndex, 1, popIndex, 2, index],
      hasChildren: false
    }))
}
