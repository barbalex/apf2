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
  const zieljahr = activeNodes.zieljahr
  const zieljahrIndex = findIndex(tree.filteredAndSorted.zieljahr, {
    jahr: zieljahr
  })
  const ziel = activeNodes.ziel
  const zielIndex = findIndex(tree.filteredAndSorted.ziel, { ZielId: ziel })

  // map through all and create array of nodes
  return tree.filteredAndSorted.zielber.map((el, index) => ({
    nodeType: `table`,
    menuType: `zielber`,
    id: el.ZielBerId,
    parentId: el.ZielId,
    urlLabel: el.ZielBerId,
    label: el.label,
    url: [
      `Projekte`,
      projId,
      `Arten`,
      apArtId,
      `AP-Ziele`,
      zieljahr,
      el.ZielId,
      `Berichte`,
      el.ZielBerId
    ],
    sort: [projIndex, 1, apIndex, 2, zieljahrIndex, zielIndex, 1, index],
    hasChildren: false
  }))
}
