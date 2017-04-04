import findIndex from 'lodash/findIndex'

export default (store, tree) => {
  // fetch sorting indexes of parents
  const projId = tree.activeNodes.projekt
  if (!projId) return []
  const projIndex = findIndex(tree.filteredAndSorted.projekt, { ProjId: projId })
  const apArtId = tree.activeNodes.ap
  if (!apArtId) return []
  const apIndex = findIndex(tree.filteredAndSorted.ap, { ApArtId: apArtId })
  const popId = tree.activeNodes.pop
  if (!popId) return []
  const popIndex = findIndex(tree.filteredAndSorted.pop, { PopId: popId })
  const tpopId = tree.activeNodes.tpop
  if (!tpopId) return []
  const tpopIndex = findIndex(tree.filteredAndSorted.tpop, { TPopId: tpopId })
  // prevent folder from showing when nodeFilter is set
  if (tpopIndex === -1) return []

  const childrenLength = tree.filteredAndSorted.tpopbeob.length
  let message = childrenLength
  if (store.loading.includes(`beobzuordnung`)) {
    message = `...`
  }
  if (tree.nodeLabelFilter.get(`tpopbeob`)) {
    message = `${childrenLength} gefiltert`
  }

  return {
    nodeType: `folder`,
    menuType: `tpopbeobFolder`,
    id: tpopId,
    label: `Beobachtungen zugeordnet (${message})`,
    expanded: tree.activeNodes.tpopbeobFolder,
    url: [`Projekte`, projId, `Arten`, apArtId, `Populationen`, popId, `Teil-Populationen`, tpopId, `Beobachtungen`],
    sort: [projIndex, 1, apIndex, 1, popIndex, 1, tpopIndex, 6],
    hasChildren: childrenLength > 0,
  }
}
