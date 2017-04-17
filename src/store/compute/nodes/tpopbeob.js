import findIndex from 'lodash/findIndex'

export default (store, tree) => {
  const { activeNodes, filteredAndSorted } = tree
  // fetch sorting indexes of parents
  const projId = activeNodes.projekt
  if (!projId) return []
  const projIndex = findIndex(filteredAndSorted.projekt, { ProjId: projId })
  const apArtId = activeNodes.ap
  if (!apArtId) return []
  const apIndex = findIndex(filteredAndSorted.ap, { ApArtId: apArtId })
  const popId = activeNodes.pop
  if (!popId) return []
  const popIndex = findIndex(filteredAndSorted.pop, { PopId: popId })
  const tpopId = activeNodes.tpop
  if (!tpopId) return []
  const tpopIndex = findIndex(filteredAndSorted.tpop, { TPopId: tpopId })

  return filteredAndSorted.tpopbeob.map((el, index) => ({
    nodeType: `table`,
    menuType: `tpopbeob`,
    id: el.beobId,
    parentId: tpopId,
    urlLabel: el.beobId,
    label: el.label,
    url: [
      `Projekte`,
      activeNodes.projekt,
      `Arten`,
      activeNodes.ap,
      `Populationen`,
      activeNodes.pop,
      `Teil-Populationen`,
      el.TPopId,
      `Beobachtungen`,
      el.beobId
    ],
    sort: [projIndex, 1, apIndex, 1, popIndex, 1, tpopIndex, 6, index],
    hasChildren: false
  }))
}
