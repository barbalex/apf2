import findIndex from 'lodash/findIndex'

export default (store, tree) => {
  const { table } = store
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
  const tpopfreiwkontrId = activeNodes.tpopfreiwkontr
  if (!tpopfreiwkontrId) return []
  const tpopfreiwkontrIndex = findIndex(tree.filteredAndSorted.tpopfreiwkontr, { TPopKontrId: tpopfreiwkontrId })
  // prevent folder from showing when nodeFilter is set
  if (tpopfreiwkontrIndex === -1) return []

  const childrenLength = tree.filteredAndSorted.tpopfreiwkontrzaehl.length

  let message = childrenLength
  if (table.tpopkontrLoading) {
    message = `...`
  }
  if (tree.nodeLabelFilter.get(`tpopfreiwkontr`)) {
    message = `${childrenLength} gefiltert`
  }

  return {
    nodeType: `folder`,
    menuType: `tpopfreiwkontrzaehlFolder`,
    id: tpopfreiwkontrId,
    label: `Zählungen (${message})`,
    expanded: activeNodes.tpopfreiwkontrzaehlFolder,
    url: [`Projekte`, projId, `Arten`, apArtId, `Populationen`, popId, `Teil-Populationen`, tpopId, `Freiwilligen-Kontrollen`, tpopfreiwkontrId, `Zaehlungen`],
    sort: [projIndex, 1, apIndex, 1, popIndex, 1, tpopIndex, 4, tpopfreiwkontrIndex, 1],
    hasChildren: childrenLength > 0,
  }
}
