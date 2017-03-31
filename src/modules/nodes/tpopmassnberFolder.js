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

  const childrenLength = node.filteredAndSorted.tpopmassnber.length

  let message = childrenLength
  if (table.tpopmassnberLoading) {
    message = `...`
  }
  if (node.nodeLabelFilter.get(`tpopmassnber`)) {
    message = `${childrenLength} gefiltert`
  }

  return {
    nodeType: `folder`,
    menuType: `tpopmassnberFolder`,
    id: tpopId,
    label: `Massnahmen-Berichte (${message})`,
    expanded: activeUrlElements.tpopmassnberFolder,
    url: [`Projekte`, projId, `Arten`, apArtId, `Populationen`, popId, `Teil-Populationen`, tpopId, `Massnahmen-Berichte`],
    level: 8,
    sort: [projIndex, 1, apIndex, 1, popIndex, 1, tpopIndex, 2],
    childrenLength,
  }
}
