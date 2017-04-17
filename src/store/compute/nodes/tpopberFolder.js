import findIndex from 'lodash/findIndex'

export default (store, tree) => {
  const { table } = store
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
  // prevent folder from showing when nodeFilter is set
  if (tpopIndex === -1) return []

  const childrenLength = tree.filteredAndSorted.tpopber.length

  let message = childrenLength
  if (table.tpopberLoading) {
    message = `...`
  }
  if (tree.nodeLabelFilter.get(`tpopber`)) {
    message = `${childrenLength} gefiltert`
  }

  return {
    nodeType: `folder`,
    menuType: `tpopberFolder`,
    id: tpopId,
    urlLabel: `Kontroll-Berichte`,
    label: `Kontroll-Berichte (${message})`,
    url: [
      `Projekte`,
      projId,
      `Arten`,
      apArtId,
      `Populationen`,
      popId,
      `Teil-Populationen`,
      tpopId,
      `Kontroll-Berichte`
    ],
    sort: [projIndex, 1, apIndex, 1, popIndex, 1, tpopIndex, 5],
    hasChildren: childrenLength > 0
  }
}
