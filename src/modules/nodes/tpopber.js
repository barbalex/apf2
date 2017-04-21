import findIndex from 'lodash/findIndex'

export default (
  store: Object,
  tree: Object,
  projId: number,
  apArtId: number,
  popId: number,
  tpopId: number
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
  const tpopIndex = findIndex(
    tree.filteredAndSorted.tpop.filter(t => t.PopId === popId),
    { TPopId: tpopId }
  )

  return tree.filteredAndSorted.tpopber
    .filter(t => t.TPopId === tpopId)
    .map((el, index) => ({
      nodeType: `table`,
      menuType: `tpopber`,
      parentId: tpopId,
      id: el.TPopBerId,
      urlLabel: el.TPopBerId,
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
        `Kontroll-Berichte`,
        el.TPopBerId
      ],
      sort: [projIndex, 1, apIndex, 1, popIndex, 1, tpopIndex, 5, index],
      hasChildren: false
    }))
}
