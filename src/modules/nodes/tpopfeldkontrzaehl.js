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
  const tpopfeldkontrId = activeUrlElements.tpopfeldkontr
  if (!tpopfeldkontrId) return []
  const tpopfeldkontrIndex = findIndex(table.filteredAndSorted.tpopfeldkontr, { TPopKontrId: tpopfeldkontrId })

  return table.filteredAndSorted.tpopfeldkontrzaehl.map((el, index) => ({
    nodeType: `table`,
    menuType: `tpopfeldkontrzaehl`,
    id: el.TPopKontrZaehlId,
    parentId: tpopfeldkontrId,
    label: el.label,
    expanded: el.TPopKontrZaehlId === activeUrlElements.tpopfeldkontrzaehl,
    url: [`Projekte`, projId, `Arten`, apArtId, `Populationen`, popId, `Teil-Populationen`, tpopId, `Feld-Kontrollen`, tpopfeldkontrId, `Zaehlungen`, el.TPopKontrZaehlId],
    level: 11,
    sort: [projIndex, 1, apIndex, 1, popIndex, 1, tpopIndex, 3, tpopfeldkontrIndex, 1, index],
    childrenLength: 0,
  }))
}
