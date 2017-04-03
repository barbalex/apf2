import findIndex from 'lodash/findIndex'

export default (store, tree) => {
  // fetch sorting indexes of parents
  const projId = tree.activeNodes.projekt
  if (!projId) return []
  const projIndex = findIndex(tree.filteredAndSorted.projekt, { ProjId: projId })

  // map through all ap and create array of nodes
  return tree.filteredAndSorted.ap.map((el, index) => ({
    nodeType: `table`,
    menuType: `ap`,
    id: el.ApArtId,
    parentId: el.ProjId,
    label: el.label,
    expanded: el.ApArtId === tree.activeNodes.ap,
    url: [`Projekte`, el.ProjId, `Arten`, el.ApArtId],
    sort: [projIndex, 1, index],
    hasChildren: true,
  }))
}
