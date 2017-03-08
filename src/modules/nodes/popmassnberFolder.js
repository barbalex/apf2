import findIndex from 'lodash/findIndex'

export default (store) => {
  const { activeUrlElements, node, table } = store

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

  const popmassnberNodesLength = table.filteredAndSorted.popmassnber.length

  let message = popmassnberNodesLength
  if (table.popmassnberLoading) {
    message = `...`
  }
  if (node.nodeLabelFilter.get(`popmassnber`)) {
    message = `${popmassnberNodesLength} gefiltert`
  }
  const sort = [projIndex, 1, apIndex, 1, popIndex, 3]

  return {
    nodeType: `folder`,
    menuType: `popmassnberFolder`,
    id: popId,
    label: `Massnahmen-Berichte (${message})`,
    expanded: activeUrlElements.popmassnberFolder,
    url: [`Projekte`, projId, `Arten`, apArtId, `Populationen`, popId, `Massnahmen-Berichte`],
    level: 6,
    sort,
    childrenLength: popmassnberNodesLength,
  }
}
