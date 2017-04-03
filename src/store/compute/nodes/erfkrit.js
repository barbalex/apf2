import findIndex from 'lodash/findIndex'

export default (store, tree) => {
  // fetch sorting indexes of parents
  const projId = tree.activeNodes.projekt
  if (!projId) return []
  const projIndex = findIndex(tree.filteredAndSorted.projekt, { ProjId: projId })
  const apArtId = tree.activeNodes.ap
  if (!apArtId) return []
  const apIndex = findIndex(tree.filteredAndSorted.ap, { ApArtId: apArtId })

  // map through all erfkrit and create array of nodes
  return tree.filteredAndSorted.erfkrit.map((el, index) => ({
    nodeType: `table`,
    menuType: `erfkrit`,
    id: el.ErfkritId,
    parentId: el.ApArtId,
    label: el.label,
    expanded: el.ErfkritId === tree.activeNodes.erfkrit,
    url: [`Projekte`, projId, `Arten`, el.ApArtId, `AP-Erfolgskriterien`, el.ErfkritId],
    sort: [projIndex, 1, apIndex, 3, index],
    hasChildren: false,
  }))
}
