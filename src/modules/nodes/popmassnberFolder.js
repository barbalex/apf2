import findIndex from 'lodash/findIndex'

export default (
  store: Object,
  tree: Object,
  projId: number,
  apArtId: number,
  popId: number
): Array<Object> => {
  // check passed variables
  if (!store) return store.listError(new Error('no store passed'))
  if (!tree) return store.listError(new Error('no tree passed'))
  if (!projId) return store.listError(new Error('no projId passed'))
  if (!apArtId) return store.listError(new Error('no apArtId passed'))
  if (!popId) return store.listError(new Error('no popId passed'))

  const { table } = store

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
  // prevent folder from showing when nodeFilter is set
  if (popIndex === -1) return []

  const popmassnberNodesLength = tree.filteredAndSorted.popmassnber.filter(
    p => p.PopId === popId
  ).length

  let message = popmassnberNodesLength
  if (table.popmassnberLoading) {
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
