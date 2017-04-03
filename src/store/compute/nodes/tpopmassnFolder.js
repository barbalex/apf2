import findIndex from 'lodash/findIndex'

export default (store, tree) => {
  const { table } = store
  const { activeNodes } = tree

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

  const childrenLength = tree.filteredAndSorted.tpopmassn.length

  let message = childrenLength
  if (table.tpopmassnLoading) {
    message = `...`
  }
  if (tree.nodeLabelFilter.get(`tpopmassn`)) {
    message = `${childrenLength} gefiltert`
  }

  return {
    nodeType: `folder`,
    menuType: `tpopmassnFolder`,
    id: tpopId,
    label: `Massnahmen (${message})`,
    expanded: activeNodes.tpopmassnFolder,
    url: [`Projekte`, projId, `Arten`, apArtId, `Populationen`, popId, `Teil-Populationen`, tpopId, `Massnahmen`],
    sort: [projIndex, 1, apIndex, 1, popIndex, 1, tpopIndex, 1],
    hasChildren: childrenLength > 0,
  }
}
