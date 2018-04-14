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
    tree.filteredAndSorted.ap.filter(a => a.proj_id === projId),
    { id: apId }
  )
  const popIndex = findIndex(
    tree.filteredAndSorted.pop.filter(p => p.ap_id === apId),
    { id: popId }
  )

  const popmassnberNodesLength = tree.filteredAndSorted.popmassnber.filter(
    p => p.pop_id === popId
  ).length

  let message = popmassnberNodesLength
  if (store.table.popmassnberLoading) {
    message = '...'
  }
  if (tree.nodeLabelFilter.get('popmassnber')) {
    message = `${popmassnberNodesLength} gefiltert`
  }

  return [
    {
      nodeType: 'folder',
      menuType: 'popmassnberFolder',
      id: popId,
      urlLabel: 'Massnahmen-Berichte',
      label: `Massnahmen-Berichte (${message})`,
      url: [
        'Projekte',
        projId,
        'Arten',
        apId,
        'Populationen',
        popId,
        'Massnahmen-Berichte',
      ],
      sort: [projIndex, 1, apIndex, 1, popIndex, 3],
      hasChildren: popmassnberNodesLength > 0,
    },
  ]
}
