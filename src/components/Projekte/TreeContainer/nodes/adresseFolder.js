const adresseFolder = ({
  nodes: nodesPassed,
  data,
  loading,
  projektNodes,
  store,
}) => {
  const adresses = data?.allAdresses?.nodes ?? []
  const wlIndex = projektNodes.length + 2
  const nodeLabelFilterString = store.tree?.nodeLabelFilter?.adresse ?? ''

  let adresseNodesLength = adresses.length
  // before Adressen folder is active, only total count was fetched, not yet any adressen nodes
  if (adresses.length === 0)
    adresseNodesLength = data?.adressesUnfiltered?.totalCount
  let message = loading && !adresseNodesLength ? '...' : adresseNodesLength
  if (nodeLabelFilterString) {
    message = `${adresseNodesLength} gefiltert`
  }

  // only show if parent node exists
  if (!nodesPassed.map((n) => n.id).includes('wlFolder')) return []

  return [
    {
      nodeType: 'folder',
      menuType: 'adresseFolder',
      filterTable: 'adresse',
      id: 'adresseFolder',
      urlLabel: 'Adressen',
      label: `Adressen (${message})`,
      url: ['Werte-Listen', 'Adressen'],
      sort: [wlIndex, 1],
      hasChildren: adresseNodesLength > 0,
    },
  ]
}

export default adresseFolder
