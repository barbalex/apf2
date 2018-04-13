import findIndex from 'lodash/findIndex'

export default (
  store: Object,
  tree: Object,
  projId: number,
  apArtId: number,
  popId: number
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

  return tree.filteredAndSorted.tpop
    .filter(p => p.pop_id === popId)
    .map((el, index) => ({
      nodeType: 'table',
      menuType: 'tpop',
      id: el.id,
      parentId: el.pop_id,
      urlLabel: el.id,
      label: `${el.nr || '(keine Nr)'}: ${el.flurname || '(kein Flurname)'}`,
      url: [
        'Projekte',
        projId,
        'Arten',
        apArtId,
        'Populationen',
        el.pop_id,
        'Teil-Populationen',
        el.id,
      ],
      sort: [projIndex, 1, apIndex, 1, popIndex, 1, index],
      hasChildren: true,
    }))
}
