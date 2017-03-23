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

  return table.filteredAndSorted.tpopmassn.map((el, index) => ({
    nodeType: `table`,
    menuType: `tpopmassn`,
    id: el.TPopMassnId,
    parentId: tpopId,
    label: el.label,
    expanded: el.TPopMassnId === activeUrlElements.tpopmassn,
    url: [`Projekte`, projId, `Arten`, apArtId, `Populationen`, popId, `Teil-Populationen`, tpopId, `Massnahmen`, el.TPopMassnId],
    level: 9,
    sort: [projIndex, 1, apIndex, 1, popIndex, 1, tpopIndex, 1, index],
    childrenLength: 0,
  }))
}
