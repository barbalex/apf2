// @flow
import findIndex from 'lodash/findIndex'
import get from 'lodash/get'
import memoizeOne from 'memoize-one'

export default ({
  nodes: nodesPassed,
  data,
  treeName,
  loading,
  projektNodes,
  projId,
  apNodes,
  apId,
  store,
}: {
  nodes: Array<Object>,
  data: Object,
  treeName: String,
  loading: Boolean,
  projektNodes: Array<Object>,
  projId: String,
  apNodes: Array<Object>,
  apId: String,
  store: Object,
}): Array<Object> => {
  const ekfzaehleinheits = get(data, 'allEkfzaehleinheits.nodes', [])

  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, {
    id: apId,
  })
  const nodeLabelFilterString =
    get(store, `${treeName}.nodeLabelFilter.ekfzaehleinheit`) || ''

  const ekfzaehleinheitNodesLength = memoizeOne(
    () => ekfzaehleinheits.filter(el => el.apId === apId).length,
  )()
  const message = loading
    ? '...'
    : !!nodeLabelFilterString
    ? `${ekfzaehleinheitNodesLength} gefiltert`
    : ekfzaehleinheitNodesLength

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
      tableId: apId,
      urlLabel: 'EKF-Zähleinheiten',
      label: `EKF-Zähleinheiten (${message})`,
      url,
      sort: [projIndex, 1, apIndex, 9],
      hasChildren: ekfzaehleinheitNodesLength > 0,
    },
  ]
}
