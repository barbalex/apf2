import findIndex from 'lodash/findIndex'

export default (store, tree) => {
  // fetch sorting indexes of parents
  const projId = tree.activeNodes.projekt
  if (!projId) return []
  const projIndex = findIndex(tree.filteredAndSorted.projekt, { ProjId: projId })
  const apArtId = tree.activeNodes.ap
  if (!apArtId) return []
  const apIndex = findIndex(tree.filteredAndSorted.ap, { ApArtId: apArtId })
  const popId = tree.activeNodes.pop
  if (!popId) return []
  const popIndex = findIndex(tree.filteredAndSorted.pop, { PopId: popId })

  return tree.filteredAndSorted.popber.map((el, index) => ({
    nodeType: `table`,
    menuType: `popber`,
    id: el.PopBerId,
    parentId: popId,
    label: el.label,
    expanded: el.PopBerId === tree.activeNodes.popber,
    url: [`Projekte`, projId, `Arten`, apArtId, `Populationen`, popId, `Kontroll-Berichte`, el.PopBerId],
    sort: [projIndex, 1, apIndex, 1, popIndex, 2, index],
    hasChildren: false,
  }))
}
