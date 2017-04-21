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
    ProjId: projId
  })
  const apIndex = findIndex(
    tree.filteredAndSorted.ap.filter(a => a.ProjId === projId),
    { ApArtId: apArtId }
  )
  const popIndex = findIndex(
    tree.filteredAndSorted.pop.filter(p => p.ApArtId === apArtId),
    { PopId: popId }
  )

  const popmassnberNodesLength = tree.filteredAndSorted.popmassnber.filter(
    p => p.PopId === popId
  ).length

  let message = popmassnberNodesLength
  if (store.table.popmassnberLoading) {
    message = `...`
  }
  if (tree.nodeLabelFilter.get(`popmassnber`)) {
    message = `${popmassnberNodesLength} gefiltert`
  }

  return [
    {
      nodeType: `folder`,
      menuType: `popmassnberFolder`,
      id: popId,
      urlLabel: `Massnahmen-Berichte`,
      label: `Massnahmen-Berichte (${message})`,
      url: [
        `Projekte`,
        projId,
        `Arten`,
        apArtId,
        `Populationen`,
        popId,
        `Massnahmen-Berichte`
      ],
      sort: [projIndex, 1, apIndex, 1, popIndex, 3],
      hasChildren: popmassnberNodesLength > 0
    }
  ]
}
