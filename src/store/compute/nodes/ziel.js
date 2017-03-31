import findIndex from 'lodash/findIndex'

export default (store, jahr) => {
  const { activeUrlElements, tree } = store
  // fetch sorting indexes of parents
  const projId = activeUrlElements.projekt
  if (!projId) return []
  const projIndex = findIndex(tree.filteredAndSorted.projekt, { ProjId: projId })
  const apArtId = activeUrlElements.ap
  if (!apArtId) return []
  const apIndex = findIndex(tree.filteredAndSorted.ap, { ApArtId: apArtId })
  const zieljahr = activeUrlElements.zieljahr
  const zieljahrIndex = findIndex(tree.filteredAndSorted.zieljahr, { jahr: zieljahr })

  // map through all and create array of nodes
  return tree.filteredAndSorted.ziel.map((el, index) => ({
    nodeType: `table`,
    menuType: `ziel`,
    id: el.ZielId,
    parentId: el.ApArtId,
    label: el.label,
    expanded: el.ZielId === activeUrlElements.ziel,
    url: [`Projekte`, projId, `Arten`, el.ApArtId, `AP-Ziele`, el.ZielJahr, el.ZielId],
    sort: [projIndex, 1, apIndex, 2, zieljahrIndex, index],
    hasChildren: true,
  }))
}
