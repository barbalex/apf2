import findIndex from 'lodash/findIndex'

export default (
  store: Object,
  tree: Object,
  projId: number,
  apArtId: number,
  popId: number
): Array<Object> => {
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

  return tree.filteredAndSorted.popmassnber
    .filter(p => p.PopId === popId)
    .map((el, index) => ({
      nodeType: `table`,
      menuType: `popmassnber`,
      id: el.PopMassnBerId,
      parentId: popId,
      urlLabel: el.PopMassnBerId,
      label: el.label,
      url: [
        `Projekte`,
        projId,
        `Arten`,
        apArtId,
        `Populationen`,
        popId,
        `Massnahmen-Berichte`,
        el.PopMassnBerId
      ],
      sort: [projIndex, 1, apIndex, 1, popIndex, 3, index],
      hasChildren: false
    }))
}
