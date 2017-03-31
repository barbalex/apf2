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

  // map through all projekt and create array of nodes
  return node.filteredAndSorted.ber.map((el, index) => ({
    nodeType: `table`,
    menuType: `ber`,
    id: el.BerId,
    parentId: el.ApArtId,
    label: el.label,
    expanded: el.BerId === activeUrlElements.ber,
    url: [`Projekte`, projId, `Arten`, el.ApArtId, `Berichte`, el.BerId],
    sort: [projIndex, 1, apIndex, 5, index],
    hasChildren: false,
  }))
}
