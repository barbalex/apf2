import findIndex from 'lodash/findIndex'

export default (
  store: Object,
  tree: Object,
  projId: number,
  apId: number,
  popId: number,
  tpopId: number
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
  const tpopIndex = findIndex(
    tree.filteredAndSorted.tpop.filter(t => t.pop_id === popId),
    { id: tpopId }
  )

  const childrenLength = tree.filteredAndSorted.tpopfreiwkontr.filter(
    t => t.tpop_id === tpopId
  ).length

  let message = childrenLength
  if (store.table.tpopkontrLoading) {
    message = '...'
  }
  if (tree.nodeLabelFilter.get('tpopfreiwkontr')) {
    message = `${childrenLength} gefiltert`
  }

  return [
    {
      nodeType: 'folder',
      menuType: 'tpopfreiwkontrFolder',
      id: tpopId,
      urlLabel: 'Freiwilligen-Kontrollen',
      label: `Freiwilligen-Kontrollen (${message})`,
      url: [
        'Projekte',
        projId,
        'Arten',
        apId,
        'Populationen',
        popId,
        'Teil-Populationen',
        tpopId,
        'Freiwilligen-Kontrollen',
      ],
      sort: [projIndex, 1, apIndex, 1, popIndex, 1, tpopIndex, 4],
      hasChildren: childrenLength > 0,
    },
  ]
}
