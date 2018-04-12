import findIndex from 'lodash/findIndex'

export default (
  store: Object,
  tree: Object,
  projId: number,
  apArtId: number,
  popId: number,
  tpopId: number
): Array<Object> => {
  // fetch sorting indexes of parents
  const projIndex = findIndex(tree.filteredAndSorted.projekt, {
    ProjId: projId,
  })
  const apIndex = findIndex(
    tree.filteredAndSorted.ap.filter(a => a.ProjId === projId),
    { ApArtId: apArtId }
  )
  const popIndex = findIndex(
    tree.filteredAndSorted.pop.filter(p => p.ApArtId === apArtId),
    { PopId: popId }
  )
  const tpopIndex = findIndex(
    tree.filteredAndSorted.tpop.filter(t => t.pop_id === popId),
    { id: tpopId }
  )

  const childrenLength = tree.filteredAndSorted.tpopfeldkontr.filter(
    t => t.tpop_id === tpopId
  ).length

  let message = childrenLength
  if (store.table.tpopkontrLoading) {
    message = '...'
  }
  if (tree.nodeLabelFilter.get('tpopfeldkontr')) {
    message = `${childrenLength} gefiltert`
  }

  return [
    {
      nodeType: 'folder',
      menuType: 'tpopfeldkontrFolder',
      id: tpopId,
      urlLabel: 'Feld-Kontrollen',
      label: `Feld-Kontrollen (${message})`,
      url: [
        'Projekte',
        projId,
        'Arten',
        apArtId,
        'Populationen',
        popId,
        'Teil-Populationen',
        tpopId,
        'Feld-Kontrollen',
      ],
      sort: [projIndex, 1, apIndex, 1, popIndex, 1, tpopIndex, 3],
      hasChildren: childrenLength > 0,
    },
  ]
}
