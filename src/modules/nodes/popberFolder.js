import findIndex from 'lodash/findIndex'

export default (
  store: Object,
  tree: Object,
  projId: number,
  apId: number,
  popId: number
): Array<Object> => {
  const { table } = store

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

  const popberNodesLength = tree.filteredAndSorted.popber.filter(
    p => p.pop_id === popId
  ).length

  let message = popberNodesLength
  if (table.popberLoading) {
    message = '...'
  }
  if (tree.nodeLabelFilter.get('popber')) {
    message = `${popberNodesLength} gefiltert`
  }

  return [
    {
      nodeType: 'folder',
      menuType: 'popberFolder',
      id: popId,
      urlLabel: 'Kontroll-Berichte',
      label: `Kontroll-Berichte (${message})`,
      url: [
        'Projekte',
        projId,
        'Aktionspläne',
        apId,
        'Populationen',
        popId,
        'Kontroll-Berichte',
      ],
      sort: [projIndex, 1, apIndex, 1, popIndex, 2],
      hasChildren: popberNodesLength > 0,
    },
  ]
}
