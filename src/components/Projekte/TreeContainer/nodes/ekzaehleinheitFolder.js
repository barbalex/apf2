import findIndex from 'lodash/findIndex'

const ekzaehleinheitFolderNode = ({
  nodes: nodesPassed,
  data,
  loading,
  projektNodes,
  projId,
  apNodes,
  apId,
  store,
}) => {
  const ekzaehleinheits = data?.allEkzaehleinheits?.nodes ?? []

  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, {
    id: apId,
  })
  const nodeLabelFilterString =
    store.tree?.nodeLabelFilter?.ekzaehleinheit ?? ''

  const ekzaehleinheitNodesLength = ekzaehleinheits.filter(
    (el) => el.apId === apId,
  ).length
  const message = loading
    ? '...'
    : nodeLabelFilterString
    ? `${ekzaehleinheitNodesLength} gefiltert`
    : ekzaehleinheitNodesLength

  const url = ['Projekte', projId, 'Arten', apId, 'EK-Zähleinheiten']

  // only show if parent node exists
  const apNodesIds = nodesPassed.map((n) => n.id)
  if (!apNodesIds.includes(apId)) return []

  return [
    {
      nodeType: 'folder',
      menuType: 'ekzaehleinheitFolder',
      filterTable: 'ekzaehleinheit',
      id: `${apId}Ekzaehleinheit`,
      tableId: apId,
      urlLabel: 'EK-Zähleinheiten',
      label: `EK-Zähleinheiten (${message})`,
      url,
      sort: [projIndex, 1, apIndex, 10],
      hasChildren: ekzaehleinheitNodesLength > 0,
    },
  ]
}

export default ekzaehleinheitFolderNode
