import findIndex from 'lodash/findIndex'

export default (store) => {
  const { activeUrlElements, table, node } = store

  // fetch sorting indexes of parents
  const projId = activeUrlElements.projekt
  if (!projId) return []
  const projIndex = findIndex(store.table.filteredAndSorted.projekt, { ProjId: projId })
  const apArtId = activeUrlElements.ap
  if (!apArtId) return []
  const apIndex = findIndex(store.table.filteredAndSorted.ap, { ApArtId: apArtId })

  const zieljahreNodesLength = table.filteredAndSorted.erfkrit.length

  let message = `${zieljahreNodesLength} Jahre`
  if (store.table.zielLoading) {
    message = `...`
  }
  if (store.node.nodeLabelFilter.get(`ziel`)) {
    const jahreTxt = zieljahreNodesLength === 1 ? `Jahr` : `Jahre`
    message = `${zieljahreNodesLength} ${jahreTxt} gefiltert`
  }
  const sort = [projIndex, 1, apIndex, 2]

  return {
    nodeType: `folder`,
    menuType: `zielFolder`,
    id: apArtId,
    label: `AP-Ziele (${message})`,
    expanded: activeUrlElements.zielFolder,
    url: [`Projekte`, projId, `Arten`, apArtId, `AP-Ziele`],
    level: 4,
    sort,
    childrenLength: zieljahreNodesLength,
  }
}
