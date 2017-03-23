import findIndex from 'lodash/findIndex'

export default (store, zielId) => {
  const { activeUrlElements, table } = store
  // fetch sorting indexes of parents
  const projId = activeUrlElements.projekt
  if (!projId) return []
  const projIndex = findIndex(table.filteredAndSorted.projekt, { ProjId: projId })
  const apArtId = activeUrlElements.ap
  if (!apArtId) return []
  const apIndex = findIndex(table.filteredAndSorted.ap, { ApArtId: apArtId })
  const zieljahr = activeUrlElements.zieljahr
  const zieljahrIndex = findIndex(table.filteredAndSorted.zieljahr, { jahr: zieljahr })
  const ziel = activeUrlElements.ziel
  const zielIndex = findIndex(table.filteredAndSorted.ziel, { ZielId: ziel })

  // map through all and create array of nodes
  return table.filteredAndSorted.zielber.map((el, index) => ({
    nodeType: `table`,
    menuType: `zielber`,
    id: el.ZielBerId,
    parentId: el.ZielId,
    label: el.label,
    expanded: el.ZielBerId === activeUrlElements.zielber,
    url: [`Projekte`, projId, `Arten`, apArtId, `AP-Ziele`, zieljahr, el.ZielId, `Berichte`, el.ZielBerId],
    level: 8,
    sort: [projIndex, 1, apIndex, 2, zieljahrIndex, zielIndex, 1, index],
    childrenLength: 0,
  }))
}
