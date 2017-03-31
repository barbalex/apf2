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

  return node.filteredAndSorted.popber.map((el, index) => ({
    nodeType: `table`,
    menuType: `popber`,
    id: el.PopBerId,
    parentId: popId,
    label: el.label,
    expanded: el.PopBerId === activeUrlElements.popber,
    url: [`Projekte`, projId, `Arten`, apArtId, `Populationen`, popId, `Kontroll-Berichte`, el.PopBerId],
    level: 7,
    sort: [projIndex, 1, apIndex, 1, popIndex, 2, index],
    hasChildren: false,
  }))
}
