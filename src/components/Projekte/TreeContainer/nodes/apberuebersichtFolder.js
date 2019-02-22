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
  const apberuebersichts = get(data, 'allApberuebersichts.nodes', [])

  // fetch sorting indexes of parents
  const projNodeIds = projektNodes.map(n => n.id)
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const nodeLabelFilterString = get(
    mobxStore,
    `${treeName}.nodeLabelFilter.apberuebersicht`,
  )

  const apberuebersichtNodesLength = memoizeOne(
    () =>
      apberuebersichts
        .filter(el => projNodeIds.includes(el.projId))
        // filter by nodeLabelFilter
        .filter(el => {
          if (nodeLabelFilterString) {
            return el.jahr.toString().includes(nodeLabelFilterString)
          }
          return true
        }).length,
  )()
  let message =
    loading && !apberuebersichtNodesLength ? '...' : apberuebersichtNodesLength
  if (nodeLabelFilterString) {
    message = `${apberuebersichtNodesLength} gefiltert`
  }

  // only show if parent node exists
  if (!projNodeIds.includes(projId)) return []

  return [
    {
      menuType: 'apberuebersichtFolder',
      filterTable: 'apberuebersicht',
      id: projId,
      tableId: projId,
      urlLabel: 'AP-Berichte',
      label: `AP-Berichte (${message})`,
      url: ['Projekte', projId, 'AP-Berichte'],
      sort: [projIndex, 2],
      hasChildren: apberuebersichtNodesLength > 0,
    },
  ]
}
