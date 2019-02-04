// @flow
import findIndex from 'lodash/findIndex'
import get from 'lodash/get'

export default ({
  nodes: nodesPassed,
  data,
  treeName,
  loading,
  projektNodes,
  projId,
  apNodes,
  apId,
  mobxStore,
}: {
  nodes: Array<Object>,
  data: Object,
  treeName: String,
  loading: Boolean,
  projektNodes: Array<Object>,
  projId: String,
  apNodes: Array<Object>,
  apId: String,
  mobxStore: Object,
}): Array<Object> => {
  const ekfzaehleinheits = get(data, 'allEkfzaehleinheits.nodes', [])

  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, {
    id: apId,
  })
  const nodeLabelFilterString = get(
    mobxStore,
    `${treeName}.nodeLabelFilter.ekfzaehleinheit`,
  )

  const ekfzaehleinheitNodesLength = ekfzaehleinheits
    .filter(el => el.apId === apId)
    // filter by nodeLabelFilter
    .filter(el => {
      if (nodeLabelFilterString) {
        const artname =
          get(el, 'tpopkontrzaehlEinheitWerteByZaehleinheitId.text') ||
          '(keine Zähleinheit gewählt)'
        return artname
          .toLowerCase()
          .includes(nodeLabelFilterString.toLowerCase())
      }
      return true
    }).length
  let message =
    loading && !ekfzaehleinheitNodesLength ? '...' : ekfzaehleinheitNodesLength
  if (nodeLabelFilterString) {
    message = `${ekfzaehleinheitNodesLength} gefiltert`
  }

  const url = ['Projekte', projId, 'Aktionspläne', apId, 'EKF-Zähleinheiten']

  // only show if parent node exists
  const apNodesIds = nodesPassed.map(n => n.id)
  if (!apNodesIds.includes(apId)) return []

  return [
    {
      nodeType: 'folder',
      menuType: 'ekfzaehleinheitFolder',
      filterTable: 'ekfzaehleinheit',
      id: `${apId}Ekfzaehleinheit`,
      urlLabel: 'EKF-Zähleinheiten',
      label: `EKF-Zähleinheiten (${message})`,
      url,
      sort: [projIndex, 1, apIndex, 9],
      hasChildren: ekfzaehleinheitNodesLength > 0,
    },
  ]
}
