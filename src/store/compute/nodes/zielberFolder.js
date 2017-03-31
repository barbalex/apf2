import findIndex from 'lodash/findIndex'

export default (store) => {
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

  const zielberNodesLength = node.filteredAndSorted.zielber.length

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
    sort: [projIndex, 1, apIndex, 2, zieljahrIndex, zielIndex, 1],
    hasChildren: zielberNodesLength > 0,
  }
}
