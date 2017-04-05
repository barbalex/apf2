import findIndex from 'lodash/findIndex'

export default (store, tree) => {
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

  return tree.filteredAndSorted.tpopbeob.map((el, index) => ({
    nodeType: `table`,
    menuType: `tpopbeob`,
    id: el.beobId,
    parentId: tpopId,
    urlLabel: el.beobId,
    label: el.label,
    expanded: el.beobId === activeNodes.tpopbeob,
    url: [`Projekte`, activeNodes.projekt, `Arten`, activeNodes.ap, `Populationen`, activeNodes.pop, `Teil-Populationen`, el.TPopId, `Beobachtungen`, el.beobId],
    sort: [projIndex, 1, apIndex, 1, popIndex, 1, tpopIndex, 6, index],
    hasChildren: false,
  }))
}
