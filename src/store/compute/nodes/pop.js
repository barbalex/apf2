import findIndex from 'lodash/findIndex'

export default (store, tree) => {
  // fetch sorting indexes of parents
  const projId = tree.activeNodes.projekt
  if (!projId) return []
  const projIndex = findIndex(tree.filteredAndSorted.projekt, { ProjId: projId })
  const apArtId = tree.activeNodes.ap
  if (!apArtId) return []
  const apIndex = findIndex(tree.filteredAndSorted.ap, { ApArtId: apArtId })

  // map through all pop and create array of nodes
  return tree.filteredAndSorted.pop.map((el, index) => ({
    nodeType: `table`,
    menuType: `pop`,
    id: el.PopId,
    parentId: el.ApArtId,
    label: el.label,
    expanded: el.PopId === tree.activeNodes.pop,
    url: [`Projekte`, projId, `Arten`, el.ApArtId, `Populationen`, el.PopId],
    sort: [projIndex, 1, apIndex, 1, index],
    hasChildren: true,
  }))
}
