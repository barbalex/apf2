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

  return tree.filteredAndSorted.tpopfreiwkontrzaehl
    .filter(z => z.TPopKontrId === tpopkontrId)
    .map((el, index) => ({
      nodeType: 'table',
      menuType: 'tpopfreiwkontrzaehl',
      id: el.TPopKontrZaehlId,
      parentId: tpopkontrId,
      urlLabel: el.TPopKontrZaehlId,
      label: el.label,
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
        el.TPopKontrZaehlId,
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
        index,
      ],
      hasChildren: false,
    }))
}
