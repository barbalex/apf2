import findIndex from 'lodash/findIndex'
import union from 'lodash/union'

const apzielFolderNode = ({
  nodes: nodesPassed,
  data,
  treeName,
  loading,
  projektNodes,
  projId,
  apNodes,
  apId,
  store,
}) => {
  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, {
    id: apId,
  })
  const nodeLabelFilterString =
    store?.[`${treeName}.nodeLabelFilter.ziel`] ?? ''

  const zieljahre = (data?.allZiels?.nodes ?? [])
    .filter((el) => el.apId === apId)
    // reduce to distinct years
    .reduce((a, el) => union(a, [el.jahr]), [])
  const zieljahreLength = zieljahre.length
  const message = loading
    ? '...'
    : nodeLabelFilterString
    ? `${zieljahreLength} ${zieljahreLength === 1 ? 'Jahr' : 'Jahre'} gefiltert`
    : `${zieljahreLength} ${zieljahreLength === 1 ? 'Jahr' : 'Jahre'}`

  const url = ['Projekte', projId, 'Aktionspläne', apId, 'AP-Ziele']

  // only show if parent node exists
  if (!nodesPassed.map((n) => n.id).includes(apId)) return []

  return [
    {
      nodeType: 'folder',
      menuType: 'zielFolder',
      filterTable: 'ziel',
      id: apId,
      tableId: apId,
      urlLabel: 'AP-Ziele',
      label: `AP-Ziele (${message})`,
      url,
      sort: [projIndex, 1, apIndex, 2],
      hasChildren: zieljahreLength > 0,
    },
  ]
}

export default apzielFolderNode
