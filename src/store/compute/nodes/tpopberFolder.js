import findIndex from 'lodash/findIndex'

export default (store) => {
  const { activeUrlElements, node, table } = store

  // fetch sorting indexes of parents
  const projId = activeUrlElements.projekt
  if (!projId) return []
  const projIndex = findIndex(node.filteredAndSorted.projekt, { ProjId: projId })
  const apArtId = activeUrlElements.ap
  if (!apArtId) return []
  const apIndex = findIndex(node.filteredAndSorted.ap, { ApArtId: apArtId })
  const popId = activeUrlElements.pop
  if (!popId) return []
  const popIndex = findIndex(node.filteredAndSorted.pop, { PopId: popId })
  const tpopId = activeUrlElements.tpop
  if (!tpopId) return []
  const tpopIndex = findIndex(node.filteredAndSorted.tpop, { TPopId: tpopId })

  const childrenLength = node.filteredAndSorted.tpopber.length

  let message = childrenLength
  if (table.tpopberLoading) {
    message = `...`
  }
  if (node.nodeLabelFilter.get(`tpopber`)) {
    message = `${childrenLength} gefiltert`
  }

  return {
    nodeType: `folder`,
    menuType: `tpopberFolder`,
    id: tpopId,
    label: `Kontroll-Berichte (${message})`,
    expanded: activeUrlElements.tpopberFolder,
    url: [`Projekte`, projId, `Arten`, apArtId, `Populationen`, popId, `Teil-Populationen`, tpopId, `Kontroll-Berichte`],
    level: 8,
    sort: [projIndex, 1, apIndex, 1, popIndex, 1, tpopIndex, 5],
    hasChildren: childrenLength > 0,
  }
}
