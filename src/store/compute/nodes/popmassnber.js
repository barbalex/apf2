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
  const popId = activeUrlElements.pop
  if (!popId) return []
  const popIndex = findIndex(node.filteredAndSorted.pop, { PopId: popId })

  return node.filteredAndSorted.popmassnber.map((el, index) => ({
    nodeType: `table`,
    menuType: `popmassnber`,
    id: el.PopMassnBerId,
    parentId: popId,
    label: el.label,
    expanded: el.PopMassnBerId === activeUrlElements.popmassnber,
    url: [`Projekte`, projId, `Arten`, apArtId, `Populationen`, popId, `Massnahmen-Berichte`, el.PopMassnBerId],
    sort: [projIndex, 1, apIndex, 1, popIndex, 3, index],
    hasChildren: false,
  }))
}
