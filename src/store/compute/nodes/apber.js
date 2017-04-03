import findIndex from 'lodash/findIndex'

export default (store, tree) => {
  // fetch sorting indexes of parents
  const projId = tree.activeNodes.projekt
  if (!projId) return []
  const projIndex = findIndex(tree.filteredAndSorted.projekt, { ProjId: projId })
  const apArtId = tree.activeNodes.ap
  if (!apArtId) return []
  const apIndex = findIndex(tree.filteredAndSorted.ap, { ApArtId: apArtId })

  // map through all projekt and create array of nodes
  return tree.filteredAndSorted.apber.map((el, index) => ({
    nodeType: `table`,
    menuType: `apber`,
    id: el.JBerId,
    parentId: el.ApArtId,
    label: el.label,
    expanded: el.JBerJahr === tree.activeNodes.apber,
    url: [`Projekte`, projId, `Arten`, el.ApArtId, `AP-Berichte`, el.JBerId],
    sort: [projIndex, 1, apIndex, 4, index],
    hasChildren: false,
  }))
}
