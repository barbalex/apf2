import findIndex from 'lodash/findIndex'

export default (store) => {
  const { activeNodes, tree, table } = store

  // fetch sorting indexes of parents
  const projId = activeNodes.projekt
  if (!projId) return []
  const projIndex = findIndex(tree.filteredAndSorted.projekt, { ProjId: projId })
  const apArtId = activeNodes.ap
  if (!apArtId) return []
  const apIndex = findIndex(tree.filteredAndSorted.ap, { ApArtId: apArtId })

  const berNodesLength = tree.filteredAndSorted.ber.length

  let message = berNodesLength
  if (table.berLoading) {
    message = `...`
  }
  if (tree.nodeLabelFilter.get(`ber`)) {
    message = `${berNodesLength} gefiltert`
  }

  return {
    nodeType: `folder`,
    menuType: `berFolder`,
    id: apArtId,
    label: `Berichte (${message})`,
    expanded: activeNodes.berFolder,
    url: [`Projekte`, projId, `Arten`, apArtId, `Berichte`],
    sort: [projIndex, 1, apIndex, 5],
    hasChildren: berNodesLength > 0,
  }
}
