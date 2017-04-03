import findIndex from 'lodash/findIndex'

export default (store) => {
  const { activeNodes, tree } = store
  // fetch sorting indexes of parents
  const projId = activeNodes.projekt
  if (!projId) return []
  const projIndex = findIndex(store.tree.filteredAndSorted.projekt, { ProjId: projId })
  const apArtId = activeNodes.ap
  if (!apArtId) return []
  const apIndex = findIndex(store.tree.filteredAndSorted.ap, { ApArtId: apArtId })

  // map through all projekt and create array of nodes
  return tree.filteredAndSorted.ber.map((el, index) => ({
    nodeType: `table`,
    menuType: `ber`,
    id: el.BerId,
    parentId: el.ApArtId,
    label: el.label,
    expanded: el.BerId === activeNodes.ber,
    url: [`Projekte`, projId, `Arten`, el.ApArtId, `Berichte`, el.BerId],
    sort: [projIndex, 1, apIndex, 5, index],
    hasChildren: false,
  }))
}
