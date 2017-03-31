import findIndex from 'lodash/findIndex'

export default (store) => {
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
  const ziel = activeUrlElements.ziel
  const zielIndex = findIndex(tree.filteredAndSorted.ziel, { ZielId: ziel })

  const zielberNodesLength = tree.filteredAndSorted.zielber.length

  let message = zielberNodesLength
  if (store.table.zielberLoading) {
    message = `...`
  }
  if (store.tree.nodeLabelFilter.get(`zielber`)) {
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
