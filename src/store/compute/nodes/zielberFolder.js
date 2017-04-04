import findIndex from 'lodash/findIndex'

export default (store, tree) => {
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
  const ziel = activeNodes.ziel
  const zielIndex = findIndex(tree.filteredAndSorted.ziel, { ZielId: ziel })
  // prevent folder from showing when nodeFilter is set
  if (zielIndex === -1) return []

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
    expanded: activeNodes.zielberFolder,
    url: [`Projekte`, projId, `Arten`, apArtId, `AP-Ziele`, zieljahr, ziel, `Berichte`],
    sort: [projIndex, 1, apIndex, 2, zieljahrIndex, zielIndex, 1],
    hasChildren: zielberNodesLength > 0,
  }
}
