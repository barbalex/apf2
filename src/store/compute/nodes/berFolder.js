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

  const berNodesLength = node.filteredAndSorted.ber.length

  let message = berNodesLength
  if (table.berLoading) {
    message = `...`
  }
  if (node.nodeLabelFilter.get(`ber`)) {
    message = `${berNodesLength} gefiltert`
  }

  return {
    nodeType: `folder`,
    menuType: `berFolder`,
    id: apArtId,
    label: `Berichte (${message})`,
    expanded: activeUrlElements.berFolder,
    url: [`Projekte`, projId, `Arten`, apArtId, `Berichte`],
    level: 4,
    sort: [projIndex, 1, apIndex, 5],
    childrenLength: berNodesLength,
  }
}
