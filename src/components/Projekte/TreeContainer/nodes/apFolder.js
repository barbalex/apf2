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
  mobxStore,
}: {
  nodes: Array<Object>,
  data: Object,
  treeName: String,
  loading: Boolean,
  projektNodes: Array<Object>,
  projId: String,
  mobxStore: Object,
}): Array<Object> => {
  const aps = get(data, 'allAps.nodes', [])

  // fetch sorting indexes of parents
  const projNodeIds = projektNodes.map(n => n.id)
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const nodeLabelFilterString =
    get(mobxStore, `${treeName}.nodeLabelFilter.ap`) || ''

  let apNodes = memoizeOne(() =>
    aps
      // only show if parent node exists
      .filter(el => projNodeIds.includes(el.projId))
      // filter by nodeLabelFilter
      .filter(el => {
        if (nodeLabelFilterString) {
          const artname = get(el, 'aeEigenschaftenByArtId.artname') || ''
          return artname
            .toLowerCase()
            .includes(nodeLabelFilterString.toLowerCase())
        }
        return true
      }),
  )()
  const apNodesLength = apNodes.length
  let message = loading && !apNodesLength ? '...' : apNodesLength
  if (nodeLabelFilterString) {
    message = `${apNodesLength} gefiltert`
  }

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
      hasChildren: apNodesLength > 0,
    },
  ]
}
