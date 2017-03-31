import findIndex from 'lodash/findIndex'

export default (store) => {
  const { activeUrlElements, tree } = store
  // fetch sorting indexes of parents
  const projId = activeUrlElements.projekt
  if (!projId) return []
  const projIndex = findIndex(tree.filteredAndSorted.projekt, { ProjId: projId })
  const apArtId = activeUrlElements.ap
  if (!apArtId) return []
  const apIndex = findIndex(tree.filteredAndSorted.ap, { ApArtId: apArtId })
  const popId = activeUrlElements.pop
  if (!popId) return []
  const popIndex = findIndex(tree.filteredAndSorted.pop, { PopId: popId })

  return tree.filteredAndSorted.popber.map((el, index) => ({
    nodeType: `table`,
    menuType: `popber`,
    id: el.PopBerId,
    parentId: popId,
    label: el.label,
    expanded: el.PopBerId === activeUrlElements.popber,
    url: [`Projekte`, projId, `Arten`, apArtId, `Populationen`, popId, `Kontroll-Berichte`, el.PopBerId],
    sort: [projIndex, 1, apIndex, 1, popIndex, 2, index],
    hasChildren: false,
  }))
}
