import findIndex from 'lodash/findIndex'

export default (
  store: Object,
  tree: Object,
  projId: number,
  apArtId: number,
  popId: number,
  tpopId: number,
  tpopkontrId: number
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
    tree.filteredAndSorted.tpop.filter(t => t.PopId === popId),
    { TPopId: tpopId }
  )
  const tpopfeldkontrIndex = findIndex(
    tree.filteredAndSorted.tpopfeldkontr.filter(t => t.TPopId === tpopId),
    {
      TPopKontrId: tpopkontrId,
    }
  )

  return tree.filteredAndSorted.tpopfeldkontrzaehl
    .filter(z => z.tpopkontr_id === tpopkontrId)
    .map((el, index) => ({
      nodeType: 'table',
      menuType: 'tpopfeldkontrzaehl',
      id: el.id,
      parentId: tpopkontrId,
      urlLabel: el.id,
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
        'Feld-Kontrollen',
        tpopkontrId,
        'Zaehlungen',
        el.id,
      ],
      sort: [
        projIndex,
        1,
        apIndex,
        1,
        popIndex,
        1,
        tpopIndex,
        3,
        tpopfeldkontrIndex,
        1,
        index,
      ],
      hasChildren: false,
    }))
}
