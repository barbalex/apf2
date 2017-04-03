import findIndex from 'lodash/findIndex'

export default (store) => {
  const { tree } = store
  const { activeNodes } = tree
  // fetch sorting indexes of parents
  const projId = activeNodes.projekt
  if (!projId) return []
  const projIndex = findIndex(tree.filteredAndSorted.projekt, { ProjId: projId })
  const apArtId = activeNodes.ap
  if (!apArtId) return []
  const apIndex = findIndex(tree.filteredAndSorted.ap, { ApArtId: apArtId })
  const popId = activeNodes.pop
  if (!popId) return []
  const popIndex = findIndex(tree.filteredAndSorted.pop, { PopId: popId })
  const tpopId = activeNodes.tpop
  if (!tpopId) return []
  const tpopIndex = findIndex(tree.filteredAndSorted.tpop, { TPopId: tpopId })
  const tpopfeldkontrId = activeNodes.tpopfeldkontr
  if (!tpopfeldkontrId) return []
  const tpopfeldkontrIndex = findIndex(tree.filteredAndSorted.tpopfeldkontr, { TPopKontrId: tpopfeldkontrId })

  return tree.filteredAndSorted.tpopfeldkontrzaehl.map((el, index) => ({
    nodeType: `table`,
    menuType: `tpopfeldkontrzaehl`,
    id: el.TPopKontrZaehlId,
    parentId: tpopfeldkontrId,
    label: el.label,
    expanded: el.TPopKontrZaehlId === activeNodes.tpopfeldkontrzaehl,
    url: [`Projekte`, projId, `Arten`, apArtId, `Populationen`, popId, `Teil-Populationen`, tpopId, `Feld-Kontrollen`, tpopfeldkontrId, `Zaehlungen`, el.TPopKontrZaehlId],
    sort: [projIndex, 1, apIndex, 1, popIndex, 1, tpopIndex, 3, tpopfeldkontrIndex, 1, index],
    hasChildren: false,
  }))
}
