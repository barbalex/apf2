import findIndex from 'lodash/findIndex'

export default (store, tree) => {
  const { activeNodes } = tree
  // fetch sorting indexes of parents
  const projId = activeNodes.projekt
  if (!projId) return []
  const projIndex = findIndex(tree.filteredAndSorted.projekt, {
    ProjId: projId
  })
  const apArtId = activeNodes.ap
  if (!apArtId) return []
  const apIndex = findIndex(tree.filteredAndSorted.ap, { ApArtId: apArtId })
  const popId = activeNodes.pop
  if (!popId) return []
  const popIndex = findIndex(tree.filteredAndSorted.pop, { PopId: popId })
  const tpopId = activeNodes.tpop
  if (!tpopId) return []
  const tpopIndex = findIndex(tree.filteredAndSorted.tpop, { TPopId: tpopId })
  const tpopfreiwkontrId = activeNodes.tpopfreiwkontr
  if (!tpopfreiwkontrId) return []
  const tpopfreiwkontrIndex = findIndex(tree.filteredAndSorted.tpopfreiwkontr, {
    TPopKontrId: tpopfreiwkontrId
  })

  return tree.filteredAndSorted.tpopfreiwkontrzaehl.map((el, index) => ({
    nodeType: `table`,
    menuType: `tpopfreiwkontrzaehl`,
    id: el.TPopKontrZaehlId,
    parentId: tpopfreiwkontrId,
    urlLabel: el.TPopKontrZaehlId,
    label: el.label,
    url: [
      `Projekte`,
      projId,
      `Arten`,
      apArtId,
      `Populationen`,
      popId,
      `Teil-Populationen`,
      tpopId,
      `Freiwilligen-Kontrollen`,
      tpopfreiwkontrId,
      `Zaehlungen`,
      el.TPopKontrZaehlId
    ],
    sort: [
      projIndex,
      1,
      apIndex,
      1,
      popIndex,
      1,
      tpopIndex,
      4,
      tpopfreiwkontrIndex,
      1,
      index
    ],
    hasChildren: false
  }))
}
