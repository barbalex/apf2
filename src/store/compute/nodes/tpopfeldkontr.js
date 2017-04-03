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

  return tree.filteredAndSorted.tpopfeldkontr.map((el, index) => ({
    nodeType: `table`,
    menuType: `tpopfeldkontr`,
    id: el.TPopKontrId,
    parentId: tpopId,
    label: el.label,
    expanded: el.TPopKontrId === activeNodes.tpopfeldkontr,
    url: [`Projekte`, projId, `Arten`, apArtId, `Populationen`, popId, `Teil-Populationen`, tpopId, `Feld-Kontrollen`, el.TPopKontrId],
    sort: [projIndex, 1, apIndex, 1, popIndex, 1, tpopIndex, 3, index],
    hasChildren: true,
  }))
}
