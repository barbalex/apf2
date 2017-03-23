import findIndex from 'lodash/findIndex'

export default (store) => {
  const { activeUrlElements, table } = store
  // fetch sorting indexes of parents
  const projId = activeUrlElements.projekt
  if (!projId) return []
  const projIndex = findIndex(table.filteredAndSorted.projekt, { ProjId: projId })
  const apArtId = activeUrlElements.ap
  if (!apArtId) return []
  const apIndex = findIndex(table.filteredAndSorted.ap, { ApArtId: apArtId })
  const popId = activeUrlElements.pop
  if (!popId) return []
  const popIndex = findIndex(table.filteredAndSorted.pop, { PopId: popId })

  return table.filteredAndSorted.popber.map((el, index) => ({
    nodeType: `table`,
    menuType: `popber`,
    id: el.PopBerId,
    parentId: popId,
    label: el.label,
    expanded: el.PopBerId === activeUrlElements.popber,
    url: [`Projekte`, projId, `Arten`, apArtId, `Populationen`, popId, `Kontroll-Berichte`, el.PopBerId],
    level: 7,
    sort: [projIndex, 1, apIndex, 1, popIndex, 2, index],
    childrenLength: 0,
  }))
}
