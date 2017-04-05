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
  // prevent folder from showing when nodeFilter is set
  if (popIndex === -1) return []

  const popberNodesLength = tree.filteredAndSorted.popber.length

  let message = popberNodesLength
  if (table.popberLoading) {
    message = `...`
  }
  if (tree.nodeLabelFilter.get(`popber`)) {
    message = `${popberNodesLength} gefiltert`
  }

  return {
    nodeType: `folder`,
    menuType: `popberFolder`,
    id: popId,
    urlLabel: `Kontroll-Berichte`,
    label: `Kontroll-Berichte (${message})`,
    expanded: activeNodes.popberFolder,
    url: [`Projekte`, projId, `Arten`, apArtId, `Populationen`, popId, `Kontroll-Berichte`],
    sort: [projIndex, 1, apIndex, 1, popIndex, 2],
    hasChildren: popberNodesLength > 0,
  }
}
