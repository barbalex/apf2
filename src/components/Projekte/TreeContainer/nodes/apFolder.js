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
  store,
}: {
  nodes: Array<Object>,
  data: Object,
  treeName: String,
  loading: Boolean,
  projektNodes: Array<Object>,
  projId: String,
  store: Object,
}): Array<Object> => {
  // fetch sorting indexes of parents
  const projNodeIds = projektNodes.map(n => n.id)
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const nodeLabelFilterString =
    get(store, `${treeName}.nodeLabelFilter.ap`) || ''

  const apNodes = memoizeOne(() =>
    get(data, 'allAps.nodes', [])
      // only show if parent node exists
      .filter(el => projNodeIds.includes(el.projId)),
  )()
  const message = loading
    ? '...'
    : !!nodeLabelFilterString
    ? `${apNodes.length} gefiltert`
    : apNodes.length

  // only show if parent node exists
  if (!projNodeIds.includes(projId)) return []

  return [
    {
      nodeType: 'folder',
      menuType: 'apFolder',
      filterTable: 'ap',
      id: `${projId}ApFolder`,
      tableId: projId,
      urlLabel: 'Aktionspläne',
      label: `Aktionspläne (${message})`,
      url: ['Projekte', projId, 'Aktionspläne'],
      sort: [projIndex, 1],
      hasChildren: apNodes.length > 0,
    },
  ]
}
