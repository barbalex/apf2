import findIndex from 'lodash/findIndex'

export default (store, jahr) => {
  const { tree } = store
  const { activeNodes } = tree
  // fetch sorting indexes of parents
  const projId = activeNodes.projekt
  if (!projId) return []
  const projIndex = findIndex(tree.filteredAndSorted.projekt, { ProjId: projId })
  const apArtId = activeNodes.ap
  if (!apArtId) return []
  const apIndex = findIndex(tree.filteredAndSorted.ap, { ApArtId: apArtId })
  const zieljahr = activeNodes.zieljahr
  const zieljahrIndex = findIndex(tree.filteredAndSorted.zieljahr, { jahr: zieljahr })

  // map through all and create array of nodes
  return tree.filteredAndSorted.ziel.map((el, index) => ({
    nodeType: `table`,
    menuType: `ziel`,
    id: el.ZielId,
    parentId: el.ApArtId,
    label: el.label,
    expanded: el.ZielId === activeNodes.ziel,
    url: [`Projekte`, projId, `Arten`, el.ApArtId, `AP-Ziele`, el.ZielJahr, el.ZielId],
    sort: [projIndex, 1, apIndex, 2, zieljahrIndex, index],
    hasChildren: true,
  }))
}
