import findIndex from 'lodash/findIndex'

export default (store) => {
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

  const zielberNodesLength = table.filteredAndSorted.zielber.length

  let message = zielberNodesLength
  if (store.table.zielberLoading) {
    message = `...`
  }
  if (store.node.nodeLabelFilter.get(`zielber`)) {
    message = `${zielberNodesLength} gefiltert`
  }

  return {
    nodeType: `folder`,
    menuType: `zielberFolder`,
    id: ziel,
    label: `Berichte (${message})`,
    expanded: activeUrlElements.zielberFolder,
    url: [`Projekte`, projId, `Arten`, apArtId, `AP-Ziele`, zieljahr, ziel, `Berichte`],
    level: 7,
    sort: [projIndex, 1, apIndex, 2, zieljahrIndex, zielIndex, 1],
    childrenLength: zielberNodesLength,
  }
}
