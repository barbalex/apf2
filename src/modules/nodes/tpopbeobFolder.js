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
  const tpopIndex = findIndex(
    tree.filteredAndSorted.tpop.filter(t => t.PopId === popId),
    { TPopId: tpopId }
  )
  // prevent folder from showing when nodeFilter is set
  if (tpopIndex === -1) return []

  const childrenLength = tree.filteredAndSorted.tpopbeob.filter(
    t => t.TPopId === tpopId
  ).length
  let message = childrenLength
  if (store.loading.includes(`beobzuordnung`)) {
    message = `...`
  }
  if (tree.nodeLabelFilter.get(`tpopbeob`)) {
    message = `${childrenLength} gefiltert`
  }

  return [
    {
      nodeType: `folder`,
      menuType: `tpopbeobFolder`,
      id: tpopId,
      urlLabel: `Beobachtungen`,
      label: `Beobachtungen zugeordnet (${message})`,
      url: [
        `Projekte`,
        projId,
        `Arten`,
        apArtId,
        `Populationen`,
        popId,
        `Teil-Populationen`,
        tpopId,
        `Beobachtungen`
      ],
      sort: [projIndex, 1, apIndex, 1, popIndex, 1, tpopIndex, 6],
      hasChildren: childrenLength > 0
    }
  ]
}
