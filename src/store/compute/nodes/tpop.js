import findIndex from 'lodash/findIndex'

export default (store, tree) => {
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

  return tree.filteredAndSorted.tpop.map((el, index) => ({
    nodeType: `table`,
    menuType: `tpop`,
    id: el.TPopId,
    parentId: el.PopId,
    urlLabel: el.TPopId,
    label: el.label,
    url: [
      `Projekte`,
      projId,
      `Arten`,
      apArtId,
      `Populationen`,
      el.PopId,
      `Teil-Populationen`,
      el.TPopId
    ],
    sort: [projIndex, 1, apIndex, 1, popIndex, 1, index],
    hasChildren: true
  }))
}
