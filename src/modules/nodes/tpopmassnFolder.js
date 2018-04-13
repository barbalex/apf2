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
  const tpopIndex = findIndex(
    tree.filteredAndSorted.tpop.filter(t => t.pop_id === popId),
    { id: tpopId }
  )

  const childrenLength = tree.filteredAndSorted.tpopmassn.filter(
    t => t.tpop_id === tpopId
  ).length

  let message = childrenLength
  if (store.table.tpopmassnLoading) {
    message = '...'
  }
  if (tree.nodeLabelFilter.get('tpopmassn')) {
    message = `${childrenLength} gefiltert`
  }

  return [
    {
      nodeType: 'folder',
      menuType: 'tpopmassnFolder',
      id: tpopId,
      urlLabel: 'Massnahmen',
      label: `Massnahmen (${message})`,
      url: [
        'Projekte',
        projId,
        'Arten',
        apId,
        'Populationen',
        popId,
        'Teil-Populationen',
        tpopId,
        'Massnahmen',
      ],
      sort: [projIndex, 1, apIndex, 1, popIndex, 1, tpopIndex, 1],
      hasChildren: childrenLength > 0,
    },
  ]
}
