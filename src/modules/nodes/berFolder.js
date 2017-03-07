import findIndex from 'lodash/findIndex'

export default (store) => {
  const { activeUrlElements, table } = store

  // fetch sorting indexes of parents
  const projId = activeUrlElements.projekt
  if (!projId) return []
  const projIndex = findIndex(store.table.filteredAndSorted.projekt, { ProjId: projId })
  const apArtId = activeUrlElements.ap
  if (!apArtId) return []
  const apIndex = findIndex(store.table.filteredAndSorted.ap, { ApArtId: apArtId })

  const berNodesLength = table.filteredAndSorted.ber.length

  let message = berNodesLength
  if (store.table.berLoading) {
    message = `...`
  }
  if (store.node.nodeLabelFilter.get(`ber`)) {
    message = `${berNodesLength} gefiltert`
  }
  const sort = [projIndex, 1, apIndex, 5]

  return {
    nodeType: `folder`,
    menuType: `berFolder`,
    id: apArtId,
    label: `Berichte (${message})`,
    expanded: activeUrlElements.berFolder,
    url: [`Projekte`, projId, `Arten`, apArtId, `Berichte`],
    level: 4,
    sort,
    childrenLength: berNodesLength,
  }
}
