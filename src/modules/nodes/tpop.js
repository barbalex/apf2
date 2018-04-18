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
    id: projId,
  })
  const apIndex = findIndex(
    tree.filteredAndSorted.ap.filter(a => a.proj_id === projId),
    { id: apId }
  )
  const popIndex = findIndex(
    tree.filteredAndSorted.pop.filter(p => p.ap_id === apId),
    { id: popId }
  )

  return tree.filteredAndSorted.tpop
    .filter(p => p.pop_id === popId)
    .map((el, index) => ({
      nodeType: 'table',
      menuType: 'tpop',
      id: el.id,
      parentId: el.pop_id,
      urlLabel: el.id,
      label: `${el.nr || '(keine Nr)'}: ${el.flurname || '(kein Flurname)'}`,
      url: [
        'Projekte',
        projId,
        'Arten',
        apId,
        'Populationen',
        el.pop_id,
        'Teil-Populationen',
        el.id,
      ],
      sort: [projIndex, 1, apIndex, 1, popIndex, 1, index],
      hasChildren: true,
    }))
}
