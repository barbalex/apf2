import findIndex from 'lodash/findIndex'

export default (store) => {
  const { activeUrlElements, node } = store
  // fetch sorting indexes of parents
  const projId = activeUrlElements.projekt
  if (!projId) return []
  const projIndex = findIndex(node.filteredAndSorted.projekt, { ProjId: projId })
  const apArtId = activeUrlElements.ap
  if (!apArtId) return []
  const apIndex = findIndex(node.filteredAndSorted.ap, { ApArtId: apArtId })
  const popId = activeUrlElements.pop
  if (!popId) return []
  const popIndex = findIndex(node.filteredAndSorted.pop, { PopId: popId })

  return node.filteredAndSorted.tpop.map((el, index) => ({
    nodeType: `table`,
    menuType: `tpop`,
    id: el.TPopId,
    parentId: el.PopId,
    label: el.label,
    expanded: el.TPopId === activeUrlElements.tpop,
    url: [`Projekte`, projId, `Arten`, apArtId, `Populationen`, el.PopId, `Teil-Populationen`, el.TPopId],
    level: 7,
    sort: [projIndex, 1, apIndex, 1, popIndex, 1, index],
    hasChildren: true,
  }))
}
