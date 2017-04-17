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

  const childrenLength = tree.filteredAndSorted.tpop.length

  let message = childrenLength
  if (table.tpopLoading) {
    message = `...`
  }
  if (tree.nodeLabelFilter.get(`tpop`)) {
    message = `${childrenLength} gefiltert`
  }

  return {
    nodeType: `folder`,
    menuType: `tpopFolder`,
    id: popId,
    urlLabel: `Teil-Populationen`,
    label: `Teil-Populationen (${message})`,
    url: [
      `Projekte`,
      projId,
      `Arten`,
      apArtId,
      `Populationen`,
      popId,
      `Teil-Populationen`
    ],
    sort: [projIndex, 1, apIndex, 1, popIndex, 1],
    hasChildren: childrenLength > 0
  }
}
