import findIndex from 'lodash/findIndex'

export default (store, tree) => {
  const { table } = store
  const { activeNodes } = tree

  // fetch sorting indexes of parents
  const projId = activeNodes.projekt
  if (!projId) return []
  const projIndex = findIndex(tree.filteredAndSorted.projekt, {
    ProjId: projId
  })
  const apArtId = activeNodes.ap
  if (!apArtId) return []
  const apIndex = findIndex(tree.filteredAndSorted.ap, { ApArtId: apArtId })
  const popId = activeNodes.pop
  if (!popId) return []
  const popIndex = findIndex(tree.filteredAndSorted.pop, { PopId: popId })
  // prevent folder from showing when nodeFilter is set
  if (popIndex === -1) return []

  const popmassnberNodesLength = tree.filteredAndSorted.popmassnber.length

  let message = popmassnberNodesLength
  if (table.popmassnberLoading) {
    message = `...`
  }
  if (tree.nodeLabelFilter.get(`popmassnber`)) {
    message = `${popmassnberNodesLength} gefiltert`
  }

  return {
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
}
