// @flow
import get from 'lodash/get'

export default ({
  data,
  treeName,
  loading,
  projektNodes,
}: {
  data: Object,
  treeName: String,
  loading: Boolean,
  projektNodes: Array<Object>,
}): Array<Object> => {
  const adresses = get(data, 'adresses.nodes', [])
  const wlIndex = projektNodes.length + 2
  const nodeLabelFilterString = get(data, `${treeName}.nodeLabelFilter.adresse`)

  let adresseNodesLength = adresses
    // filter by nodeLabelFilter
    .filter(el => {
      if (nodeLabelFilterString) {
        const name = el.name || '(kein Name)'
        return name
          .toLowerCase()
          .includes(nodeLabelFilterString.toLowerCase())
      }
      return true
    }).length
  // before Adressen folder is active, only total count was fetched, not yet any adressen nodes
  if (adresses.length === 0) adresseNodesLength = get(data, 'adresses.totalCount')
  let message = (loading && !adresseNodesLength) ? '...' : adresseNodesLength
  if (nodeLabelFilterString) {
    message = `${adresseNodesLength} gefiltert`
  }

  return ({
    nodeType: 'folder',
    menuType: 'adresseFolder',
    id: 'adresseFolder',
    urlLabel: 'Adressen',
    label: `Adressen (${message})`,
    url: ['Werte-Listen', 'Adressen'],
    sort: [wlIndex, 1],
    hasChildren: adresseNodesLength > 0,
  })
}