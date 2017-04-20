import findIndex from 'lodash/findIndex'

export default (
  store: Object,
  tree: Object,
  projId: number,
  apArtId: number,
  popId: number,
  tpopId: number
): Array<Object> => {
  // check passed variables
  if (!store) return store.listError(new Error('no store passed'))
  if (!tree) return store.listError(new Error('no tree passed'))
  if (!projId) return store.listError(new Error('no projId passed'))
  if (!apArtId) return store.listError(new Error('no apArtId passed'))
  if (!popId) return store.listError(new Error('no popId passed'))
  if (!tpopId) return store.listError(new Error('no tpopId passed'))

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
  const tpopIndex = findIndex(
    tree.filteredAndSorted.tpop.filter(t => t.PopId === popId),
    { TPopId: tpopId }
  )
  // prevent folder from showing when nodeFilter is set
  if (tpopIndex === -1) return []

  return tree.filteredAndSorted.tpopmassnber
    .filter(t => t.TPopId === tpopId)
    .map((el, index) => ({
      nodeType: `table`,
      menuType: `tpopmassnber`,
      parentId: tpopId,
      id: el.TPopMassnBerId,
      urlLabel: el.TPopMassnBerId,
      label: el.label,
      url: [
        `Projekte`,
        projId,
        `Arten`,
        apArtId,
        `Populationen`,
        popId,
        `Teil-Populationen`,
        tpopId,
        `Massnahmen-Berichte`,
        el.TPopMassnBerId
      ],
      sort: [projIndex, 1, apIndex, 1, popIndex, 1, tpopIndex, 2, index],
      hasChildren: false
    }))
}
