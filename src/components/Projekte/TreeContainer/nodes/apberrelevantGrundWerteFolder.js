import get from 'lodash/get'

export default ({
  nodes: nodesPassed,
  data,
  treeName,
  loading,
  projektNodes,
  store,
}) => {
  const adresses = get(data, 'allApberrelevantGrundWertes.nodes', [])
  const wlIndex = projektNodes.length + 2
  const nodeLabelFilterString =
    get(store, `${treeName}.nodeLabelFilter.adresse`) || ''

  let adresseNodesLength = adresses.length
  // before ApberrelevantGrundWerte folder is active, only total count was fetched, not yet any adressen nodes
  if (adresses.length === 0)
    adresseNodesLength = get(data, 'unfiltered.totalCount')
  let message = loading && !adresseNodesLength ? '...' : adresseNodesLength
  if (nodeLabelFilterString) {
    message = `${adresseNodesLength} gefiltert`
  }

  // only show if parent node exists
  if (!nodesPassed.map(n => n.id).includes('wlFolder')) return []

  return [
    {
      nodeType: 'folder',
      menuType: 'adresseFolder',
      filterTable: 'adresse',
      id: 'adresseFolder',
      urlLabel: 'ApberRelevantGrund',
      label: `AP-Bericht relevant Grund (${message})`,
      url: ['Werte-Listen', 'ApberRelevantGrund'],
      sort: [wlIndex, 1],
      hasChildren: adresseNodesLength > 0,
    },
  ]
}
