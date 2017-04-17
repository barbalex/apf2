import findIndex from 'lodash/findIndex'

export default (store, tree) => {
  // fetch sorting indexes of parents
  const projId = tree.activeNodes.projekt
  if (!projId) return []
  const projIndex = findIndex(tree.filteredAndSorted.projekt, {
    ProjId: projId
  })
  const apArtId = tree.activeNodes.ap
  if (!apArtId) return []
  const apIndex = findIndex(tree.filteredAndSorted.ap, { ApArtId: apArtId })

  return tree.filteredAndSorted.assozart.map((el, index) => ({
    nodeType: `table`,
    menuType: `assozart`,
    id: el.AaId,
    parentId: apArtId,
    urlLabel: el.AaId,
    label: el.label,
    url: [`Projekte`, projId, `Arten`, apArtId, `assoziierte-Arten`, el.AaId],
    sort: [projIndex, 1, apIndex, 7, index],
    hasChildren: false
  }))
}
