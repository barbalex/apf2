import findIndex from 'lodash/findIndex'

export default (
  store: Object,
  tree: Object,
  projId: number,
  apArtId: number,
  popId: number,
  tpopId: number,
  tpopkontrId: number,
): Array<Object> => {
  // fetch sorting indexes of parents
  const projIndex = findIndex(tree.filteredAndSorted.projekt, {
    ProjId: projId,
  })
  const apIndex = findIndex(
    tree.filteredAndSorted.ap.filter(a => a.ProjId === projId),
    { ApArtId: apArtId },
  )
  const popIndex = findIndex(
    tree.filteredAndSorted.pop.filter(p => p.ApArtId === apArtId),
    { PopId: popId },
  )
  const tpopIndex = findIndex(
    tree.filteredAndSorted.tpop.filter(t => t.PopId === popId),
    { TPopId: tpopId },
  )
  const tpopfreiwkontrIndex = findIndex(
    tree.filteredAndSorted.tpopfreiwkontr.filter(t => t.TPopId === tpopId),
    {
      TPopKontrId: tpopkontrId,
    },
  )

  const childrenLength = tree.filteredAndSorted.tpopfreiwkontrzaehl.filter(
    z => z.TPopKontrId === tpopkontrId,
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
      menuType: 'tpopfreiwkontrzaehlFolder',
      id: tpopkontrId,
      urlLabel: 'Zaehlungen',
      label: `Zählungen (${message})`,
      url: [
        'Projekte',
        projId,
        'Arten',
        apArtId,
        'Populationen',
        popId,
        'Teil-Populationen',
        tpopId,
        'Freiwilligen-Kontrollen',
        tpopkontrId,
        'Zaehlungen',
      ],
      sort: [
        projIndex,
        1,
        apIndex,
        1,
        popIndex,
        1,
        tpopIndex,
        4,
        tpopfreiwkontrIndex,
        1,
      ],
      hasChildren: childrenLength > 0,
    },
  ]
}
