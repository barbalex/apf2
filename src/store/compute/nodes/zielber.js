import findIndex from 'lodash/findIndex'

export default (store, zielId) => {
  const { activeUrlElements, node } = store
  // fetch sorting indexes of parents
  const projId = activeUrlElements.projekt
  if (!projId) return []
  const projIndex = findIndex(node.filteredAndSorted.projekt, { ProjId: projId })
  const apArtId = activeUrlElements.ap
  if (!apArtId) return []
  const apIndex = findIndex(node.filteredAndSorted.ap, { ApArtId: apArtId })
  const zieljahr = activeUrlElements.zieljahr
  const zieljahrIndex = findIndex(node.filteredAndSorted.zieljahr, { jahr: zieljahr })
  const ziel = activeUrlElements.ziel
  const zielIndex = findIndex(node.filteredAndSorted.ziel, { ZielId: ziel })

  // map through all and create array of nodes
  return node.filteredAndSorted.zielber.map((el, index) => ({
    nodeType: `table`,
    menuType: `zielber`,
    id: el.ZielBerId,
    parentId: el.ZielId,
    label: el.label,
    expanded: el.ZielBerId === activeUrlElements.zielber,
    url: [`Projekte`, projId, `Arten`, apArtId, `AP-Ziele`, zieljahr, el.ZielId, `Berichte`, el.ZielBerId],
    level: 8,
    sort: [projIndex, 1, apIndex, 2, zieljahrIndex, zielIndex, 1, index],
    hasChildren: false,
  }))
}
