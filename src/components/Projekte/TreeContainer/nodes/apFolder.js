// @flow
import findIndex from 'lodash/findIndex'
import get from 'lodash/get'

import allParentNodesExist from '../allParentNodesExist'
import filterNodesByNodeFilterArray from '../filterNodesByNodeFilterArray'

export default ({
  nodes: nodesPassed,
  data,
  treeName,
  loading,
  projektNodes,
  projId,
  nodeFilter,
}: {
  nodes: Array<Object>,
  data: Object,
  treeName: String,
  loading: Boolean,
  projektNodes: Array<Object>,
  projId: String,
  nodeFilter: Object,
}): Array<Object> => {
  const aps = get(data, 'aps.nodes', [])
  const nodeFilterArray = Object.entries(nodeFilter.ap).filter(
    ([key, value]) => value || value === 0,
  )

  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const nodeLabelFilterString = get(data, `${treeName}.nodeLabelFilter.ap`)
  const apFilter = get(data, `${treeName}.apFilter`)

  const apNodesLength = aps
    .filter(el => el.projId === projId)
    // filter by nodeLabelFilter
    .filter(el => {
      if (nodeLabelFilterString) {
        const artname = get(el, 'aeEigenschaftenByArtId.artname') || ''
        return artname
          .toLowerCase()
          .includes(nodeLabelFilterString.toLowerCase())
      }
      return true
    })
    // filter by apFilter
    .filter(el => {
      if (apFilter) {
        return [1, 2, 3].includes(el.bearbeitung)
      }
      return true
    })
    // filter by nodeFilter
    // TODO: would be much better to filter this in query
    // this is done
    // but unfortunately query does not immediatly update
    .filter(node => filterNodesByNodeFilterArray({ node, nodeFilterArray }))
    .length
  let message = loading && !apNodesLength ? '...' : apNodesLength
  if (nodeLabelFilterString) {
    message = `${apNodesLength} gefiltert`
  }

  return [
    {
      nodeType: 'folder',
      menuType: 'apFolder',
      filterTable: 'ap',
      id: projId,
      urlLabel: 'Aktionspläne',
      label: `Aktionspläne (${message})`,
      url: ['Projekte', projId, 'Aktionspläne'],
      sort: [projIndex, 1],
      hasChildren: apNodesLength > 0,
    },
  ].filter(n => allParentNodesExist(nodesPassed, n))
}
