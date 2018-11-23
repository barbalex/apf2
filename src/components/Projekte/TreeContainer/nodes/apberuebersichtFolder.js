// @flow
import findIndex from 'lodash/findIndex'
import get from 'lodash/get'

import allParentNodesExist from '../allParentNodesExist'

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
  const apberuebersichts = get(data, 'apberuebersichts.nodes', [])

  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const nodeLabelFilterString = get(
    mobxStore,
    `${treeName}.nodeLabelFilter.apberuebersicht`,
  )

  const apberuebersichtNodesLength = apberuebersichts
    .filter(el => el.projId === projId)
    // filter by nodeLabelFilter
    .filter(el => {
      if (nodeLabelFilterString) {
        return el.jahr.toString().includes(nodeLabelFilterString)
      }
      return true
    }).length
  let message =
    loading && !apberuebersichtNodesLength ? '...' : apberuebersichtNodesLength
  if (nodeLabelFilterString) {
    message = `${apberuebersichtNodesLength} gefiltert`
  }

  return [
    {
      menuType: 'apberuebersichtFolder',
      filterTable: 'apberuebersicht',
      id: projId,
      urlLabel: 'AP-Berichte',
      label: `AP-Berichte (${message})`,
      url: ['Projekte', projId, 'AP-Berichte'],
      sort: [projIndex, 2],
      hasChildren: apberuebersichtNodesLength > 0,
    },
  ].filter(n => allParentNodesExist(nodesPassed, n))
}
