import findIndex from 'lodash/findIndex'

export default (
  store: Object,
  tree: Object,
  projId: number,
  apArtId: number,
  popId: number
): Array<Object> => {
  const { table } = store

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
        'Arten',
        apArtId,
        'Populationen',
        popId,
        'Kontroll-Berichte',
      ],
      sort: [projIndex, 1, apIndex, 1, popIndex, 2],
      hasChildren: popberNodesLength > 0,
    },
  ]
}
