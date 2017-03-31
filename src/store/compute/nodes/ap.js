import findIndex from 'lodash/findIndex'

export default (store) => {
  const { activeUrlElements, node } = store
  // fetch sorting indexes of parents
  const projId = activeUrlElements.projekt
  if (!projId) return []
  const projIndex = findIndex(store.node.filteredAndSorted.projekt, { ProjId: projId })

  // map through all ap and create array of nodes
  return node.filteredAndSorted.ap.map((el, index) => ({
    nodeType: `table`,
    menuType: `ap`,
    id: el.ApArtId,
    parentId: el.ProjId,
    label: el.label,
    expanded: el.ApArtId === activeUrlElements.ap,
    url: [`Projekte`, el.ProjId, `Arten`, el.ApArtId],
    sort: [projIndex, 1, index],
    hasChildren: true,
  }))
}
