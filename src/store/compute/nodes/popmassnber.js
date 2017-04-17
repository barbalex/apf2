import findIndex from 'lodash/findIndex'

export default (store, tree) => {
  // fetch sorting indexes of parents
  const projId = tree.activeNodes.projekt
  if (!projId) return []
  const projIndex = findIndex(tree.filteredAndSorted.projekt, {
    ProjId: projId
  })
  const apArtId = tree.activeNodes.ap
  if (!apArtId) return []
  const apIndex = findIndex(tree.filteredAndSorted.ap, { ApArtId: apArtId })
  const popId = tree.activeNodes.pop
  if (!popId) return []
  const popIndex = findIndex(tree.filteredAndSorted.pop, { PopId: popId })

  return tree.filteredAndSorted.popmassnber.map((el, index) => ({
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
