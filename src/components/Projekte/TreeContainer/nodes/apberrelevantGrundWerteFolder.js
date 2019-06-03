import get from 'lodash/get'

export default ({
  nodes: nodesPassed,
  data,
  treeName,
  loading,
  projektNodes,
  store,
}) => {
  const apberrelevantGrundWertes = get(
    data,
    'allApberrelevantGrundWertes.nodes',
    [],
  )
  const wlIndex = projektNodes.length + 2
  const nodeLabelFilterString =
    get(store, `${treeName}.nodeLabelFilter.apberrelevantGrundWerte`) || ''

  let apberrelevantGrundWerteNodesLength = apberrelevantGrundWertes.length
  // before ApberrelevantGrundWerte folder is active, only total count was fetched, not yet any apberrelevantGrundWerten nodes
  if (apberrelevantGrundWertes.length === 0)
    apberrelevantGrundWerteNodesLength = get(data, 'unfiltered.totalCount')
  let message =
    loading && !apberrelevantGrundWerteNodesLength
      ? '...'
      : apberrelevantGrundWerteNodesLength
  if (nodeLabelFilterString) {
    message = `${apberrelevantGrundWerteNodesLength} gefiltert`
  }

  // only show if parent node exists
  if (!nodesPassed.map(n => n.id).includes('wlFolder')) return []

  return [
    {
      nodeType: 'folder',
      menuType: 'tpopApberrelevantGrundWerteFolder',
      filterTable: 'tpopApberrelevantGrundWerte',
      id: 'tpopApberrelevantGrundWerteFolder',
      urlLabel: 'ApberrelevantGrundWerte',
      label: `Teil-Population: Grund für AP-Bericht Relevanz (${message})`,
      url: ['Werte-Listen', 'ApberrelevantGrundWerte'],
      sort: [wlIndex, 2],
      hasChildren: apberrelevantGrundWerteNodesLength > 0,
    },
  ]
}
