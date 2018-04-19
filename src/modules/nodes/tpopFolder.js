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

  const childrenLength = tree.filteredAndSorted.tpop.filter(
    t => t.pop_id === popId
  ).length

  let message = childrenLength
  if (store.table.tpopLoading) {
    message = '...'
  }
  if (tree.nodeLabelFilter.get('tpop')) {
    message = `${childrenLength} gefiltert`
  }

  return [
    {
      nodeType: 'folder',
      menuType: 'tpopFolder',
      id: popId,
      urlLabel: 'Teil-Populationen',
      label: `Teil-Populationen (${message})`,
      url: [
        'Projekte',
        projId,
        'Aktionspläne',
        apId,
        'Populationen',
        popId,
        'Teil-Populationen',
      ],
      sort: [projIndex, 1, apIndex, 1, popIndex, 1],
      hasChildren: childrenLength > 0,
    },
  ]
}
