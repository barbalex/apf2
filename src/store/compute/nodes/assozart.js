import findIndex from 'lodash/findIndex'

export default (store) => {
  const { activeUrlElements, tree } = store
  // fetch sorting indexes of parents
  const projId = activeUrlElements.projekt
  if (!projId) return []
  const projIndex = findIndex(store.tree.filteredAndSorted.projekt, { ProjId: projId })
  const apArtId = activeUrlElements.ap
  if (!apArtId) return []
  const apIndex = findIndex(store.tree.filteredAndSorted.ap, { ApArtId: apArtId })

  return tree.filteredAndSorted.assozart.map((el, index) => ({
    nodeType: `table`,
    menuType: `assozart`,
    id: el.AaId,
    parentId: apArtId,
    label: el.label,
    expanded: el.AaId === activeUrlElements.assozart,
    url: [`Projekte`, projId, `Arten`, apArtId, `assoziierte-Arten`, el.AaId],
    sort: [projIndex, 1, apIndex, 7, index],
    hasChildren: false,
  }))
}
