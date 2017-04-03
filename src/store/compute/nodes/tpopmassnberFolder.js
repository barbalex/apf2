import findIndex from 'lodash/findIndex'

export default (store) => {
  const { activeNodes, tree, table } = store

  // fetch sorting indexes of parents
  const projId = activeNodes.projekt
  if (!projId) return []
  const projIndex = findIndex(tree.filteredAndSorted.projekt, { ProjId: projId })
  const apArtId = activeNodes.ap
  if (!apArtId) return []
  const apIndex = findIndex(tree.filteredAndSorted.ap, { ApArtId: apArtId })
  const popId = activeNodes.pop
  if (!popId) return []
  const popIndex = findIndex(tree.filteredAndSorted.pop, { PopId: popId })
  const tpopId = activeNodes.tpop
  if (!tpopId) return []
  const tpopIndex = findIndex(tree.filteredAndSorted.tpop, { TPopId: tpopId })

  const childrenLength = tree.filteredAndSorted.tpopmassnber.length

  let message = childrenLength
  if (table.tpopmassnberLoading) {
    message = `...`
  }
  if (tree.nodeLabelFilter.get(`tpopmassnber`)) {
    message = `${childrenLength} gefiltert`
  }

  return {
    nodeType: `folder`,
    menuType: `tpopmassnberFolder`,
    id: tpopId,
    label: `Massnahmen-Berichte (${message})`,
    expanded: activeNodes.tpopmassnberFolder,
    url: [`Projekte`, projId, `Arten`, apArtId, `Populationen`, popId, `Teil-Populationen`, tpopId, `Massnahmen-Berichte`],
    sort: [projIndex, 1, apIndex, 1, popIndex, 1, tpopIndex, 2],
    hasChildren: childrenLength > 0,
  }
}
