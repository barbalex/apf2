import findIndex from 'lodash/findIndex'

export default (store) => {
  const { activeUrlElements, tree } = store

  // fetch sorting indexes of parents
  const projId = activeUrlElements.projekt
  if (!projId) return []
  const projIndex = findIndex(store.tree.filteredAndSorted.projekt, { ProjId: projId })
  const apArtId = activeUrlElements.ap
  if (!apArtId) return []
  const apIndex = findIndex(store.tree.filteredAndSorted.ap, { ApArtId: apArtId })

  const zieljahreNodesLength = tree.filteredAndSorted.zieljahr.length

  let message = `${zieljahreNodesLength} Jahre`
  if (store.table.zielLoading) {
    message = `...`
  }
  if (store.tree.nodeLabelFilter.get(`ziel`)) {
    const jahreTxt = zieljahreNodesLength === 1 ? `Jahr` : `Jahre`
    message = `${zieljahreNodesLength} ${jahreTxt} gefiltert`
  }

  return {
    nodeType: `folder`,
    menuType: `zielFolder`,
    id: apArtId,
    label: `AP-Ziele (${message})`,
    expanded: activeUrlElements.zielFolder,
    url: [`Projekte`, projId, `Arten`, apArtId, `AP-Ziele`],
    sort: [projIndex, 1, apIndex, 2],
    hasChildren: zieljahreNodesLength > 0,
  }
}
