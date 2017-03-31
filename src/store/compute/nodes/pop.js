import findIndex from 'lodash/findIndex'

export default (store) => {
  const { activeUrlElements, node } = store
  // fetch sorting indexes of parents
  const projId = activeUrlElements.projekt
  if (!projId) return []
  const projIndex = findIndex(store.node.filteredAndSorted.projekt, { ProjId: projId })
  const apArtId = activeUrlElements.ap
  if (!apArtId) return []
  const apIndex = findIndex(store.node.filteredAndSorted.ap, { ApArtId: apArtId })

  // map through all pop and create array of nodes
  return node.filteredAndSorted.pop.map((el, index) => ({
    nodeType: `table`,
    menuType: `pop`,
    id: el.PopId,
    parentId: el.ApArtId,
    label: el.label,
    expanded: el.PopId === activeUrlElements.pop,
    url: [`Projekte`, projId, `Arten`, el.ApArtId, `Populationen`, el.PopId],
    sort: [projIndex, 1, apIndex, 1, index],
    hasChildren: true,
  }))
}
