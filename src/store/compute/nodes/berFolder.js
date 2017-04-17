import findIndex from 'lodash/findIndex'

export default (store, tree) => {
  const { table } = store

  // fetch sorting indexes of parents
  const projId = tree.activeNodes.projekt
  if (!projId) return []
  const projIndex = findIndex(tree.filteredAndSorted.projekt, {
    ProjId: projId
  })
  const apArtId = tree.activeNodes.ap
  if (!apArtId) return []
  const apIndex = findIndex(tree.filteredAndSorted.ap, { ApArtId: apArtId })
  // prevent folder from showing when nodeFilter is set
  if (apIndex === -1) return []

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
    urlLabel: `Berichte`,
    label: `Berichte (${message})`,
    url: [`Projekte`, projId, `Arten`, apArtId, `Berichte`],
    sort: [projIndex, 1, apIndex, 5],
    hasChildren: berNodesLength > 0
  }
}
