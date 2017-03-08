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
  const tpopId = activeUrlElements.tpop
  if (!tpopId) return []
  const tpopIndex = findIndex(table.filteredAndSorted.tpop, { TPopId: tpopId })

  return table.filteredAndSorted.tpopber.map((el, index) => {
    const sort = [projIndex, 1, apIndex, 1, popIndex, 1, tpopIndex, 5, index]

    return {
      nodeType: `table`,
      menuType: `tpopber`,
      parentId: tpopId,
      id: el.TPopBerId,
      label: el.label,
      expanded: el.TPopBerId === activeUrlElements.tpopber,
      url: [`Projekte`, projId, `Arten`, apArtId, `Populationen`, popId, `Teil-Populationen`, tpopId, `Kontroll-Berichte`, el.TPopBerId],
      level: 8,
      sort,
      childrenLength: 0,
    }
  })
}
