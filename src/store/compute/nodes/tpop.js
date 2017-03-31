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

  return tree.filteredAndSorted.tpop.map((el, index) => ({
    nodeType: `table`,
    menuType: `tpop`,
    id: el.TPopId,
    parentId: el.PopId,
    label: el.label,
    expanded: el.TPopId === activeUrlElements.tpop,
    url: [`Projekte`, projId, `Arten`, apArtId, `Populationen`, el.PopId, `Teil-Populationen`, el.TPopId],
    sort: [projIndex, 1, apIndex, 1, popIndex, 1, index],
    hasChildren: true,
  }))
}
