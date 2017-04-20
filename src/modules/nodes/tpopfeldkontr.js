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
  // prevent folder from showing when nodeFilter is set
  if (tpopIndex === -1) return []

  return tree.filteredAndSorted.tpopfeldkontr
    .filter(t => t.TPopId === tpopId)
    .map((el, index) => ({
      nodeType: `table`,
      menuType: `tpopfeldkontr`,
      id: el.TPopKontrId,
      parentId: tpopId,
      urlLabel: el.TPopKontrId,
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
        `Feld-Kontrollen`,
        el.TPopKontrId
      ],
      sort: [projIndex, 1, apIndex, 1, popIndex, 1, tpopIndex, 3, index],
      hasChildren: true
    }))
}
