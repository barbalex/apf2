import findIndex from 'lodash/findIndex'

export default (
  store: Object,
  tree: Object,
  projId: number,
  apId: number,
  popId: number
): Array<Object> => {
  // fetch sorting indexes of parents
  const projIndex = findIndex(tree.filteredAndSorted.projekt, {
    ProjId: projId,
  })
  const apIndex = findIndex(
    tree.filteredAndSorted.ap.filter(a => a.ProjId === projId),
    { ApArtId: apId }
  )
  const popIndex = findIndex(
    tree.filteredAndSorted.pop.filter(p => p.ap_id === apId),
    { id: popId }
  )

  return tree.filteredAndSorted.popber
    .filter(p => p.pop_id === popId)
    .map((el, index) => ({
      nodeType: 'table',
      menuType: 'popber',
      id: el.id,
      parentId: popId,
      urlLabel: el.id,
      label: el.label,
      url: [
        'Projekte',
        projId,
        'Arten',
        apId,
        'Populationen',
        popId,
        'Kontroll-Berichte',
        el.id,
      ],
      sort: [projIndex, 1, apIndex, 1, popIndex, 2, index],
      hasChildren: false,
    }))
}
