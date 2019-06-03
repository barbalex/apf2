import get from 'lodash/get'

export default ({
  nodes: nodesPassed,
  data,
  treeName,
  loading,
  projektNodes,
  store,
}) => {
  const tpopkontrzaehlEinheitWertes = get(
    data,
    'allTpopkontrzaehlEinheitWertes.nodes',
    [],
  )
  const wlIndex = projektNodes.length + 2
  const nodeLabelFilterString =
    get(store, `${treeName}.nodeLabelFilter.tpopkontrzaehlEinheitWerte`) || ''

  let tpopkontrzaehlEinheitWerteNodesLength = tpopkontrzaehlEinheitWertes.length
  // before TpopkontrzaehlEinheitWerte folder is active, only total count was fetched, not yet any tpopkontrzaehlEinheitWerten nodes
  if (tpopkontrzaehlEinheitWertes.length === 0)
    tpopkontrzaehlEinheitWerteNodesLength = get(data, 'unfiltered.totalCount')
  let message =
    loading && !tpopkontrzaehlEinheitWerteNodesLength
      ? '...'
      : tpopkontrzaehlEinheitWerteNodesLength
  if (nodeLabelFilterString) {
    message = `${tpopkontrzaehlEinheitWerteNodesLength} gefiltert`
  }

  // only show if parent node exists
  if (!nodesPassed.map(n => n.id).includes('wlFolder')) return []

  return [
    {
      nodeType: 'folder',
      menuType: 'werteFolder',
      filterTable: 'tpopkontrzaehlEinheitWerte',
      id: 'tpopkontrzaehlEinheitWerteFolder',
      urlLabel: 'TpopkontrzaehlEinheitWerte',
      label: `Teil-Population: Zähl-Einheiten (${message})`,
      url: ['Werte-Listen', 'TpopkontrzaehlEinheitWerte'],
      sort: [wlIndex, 3],
      hasChildren: tpopkontrzaehlEinheitWerteNodesLength > 0,
    },
  ]
}
