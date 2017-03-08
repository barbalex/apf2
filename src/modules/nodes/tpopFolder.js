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

  const childrenLength = table.filteredAndSorted.tpop.length

  let message = childrenLength
  if (table.tpopLoading) {
    message = `...`
  }
  if (node.nodeLabelFilter.get(`tpop`)) {
    message = `${childrenLength} gefiltert`
  }
  const sort = [projIndex, 1, apIndex, 1, popIndex, 1]

  return {
    nodeType: `folder`,
    menuType: `tpopFolder`,
    id: popId,
    label: `Teil-Populationen (${message})`,
    expanded: activeUrlElements.tpopFolder,
    url: [`Projekte`, projId, `Arten`, apArtId, `Populationen`, popId, `Teil-Populationen`],
    level: 6,
    sort,
    childrenLength,
  }
}
