import findIndex from 'lodash/findIndex'

const apFolderNode = ({ data, loading, projektNodes, projId, store }) => {
  // fetch sorting indexes of parents
  const projNodeIds = projektNodes.map((n) => n.id)
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const nodeLabelFilterString = store.tree?.nodeLabelFilter?.ap ?? ''

  const count = data?.allAps?.totalCount ?? 0

  const message = loading
    ? '...'
    : nodeLabelFilterString
    ? `${count} gefiltert`
    : count

  // only show if parent node exists
  if (!projNodeIds.includes(projId)) return []

  return [
    {
      nodeType: 'folder',
      menuType: 'apFolder',
      filterTable: 'ap',
      id: `${projId}ApFolder`,
      tableId: projId,
      urlLabel: 'Arten',
      label: `Arten (${message})`,
      url: ['Projekte', projId, 'Arten'],
      sort: [projIndex, 1],
      hasChildren: count > 0,
    },
  ]
}

export default apFolderNode
