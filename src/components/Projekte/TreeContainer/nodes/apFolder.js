// @flow
import findIndex from 'lodash/findIndex'
import get from 'lodash/get'
import uniqBy from 'lodash/uniqBy'

import allParentNodesExist from '../allParentNodesExist'
import filterNodesByNodeFilterArray from '../filterNodesByNodeFilterArray'
import filterNodesByApFilter from '../filterNodesByApFilter'

export default ({
  nodes: nodesPassed,
  data,
  treeName,
  loading,
  projektNodes,
  projId,
  nodeFilter,
  mobxStore,
}: {
  nodes: Array<Object>,
  data: Object,
  treeName: String,
  loading: Boolean,
  projektNodes: Array<Object>,
  projId: String,
  nodeFilter: Object,
  mobxStore: Object,
}): Array<Object> => {
  const aps = get(data, 'allAps.nodes', [])
  const nodeFilterArray = Object.entries(nodeFilter.ap).filter(
    ([key, value]) => value || value === 0 || value === false,
  )

  // fetch sorting indexes of parents
  const projNodeIds = projektNodes.map(n => n.id)
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const nodeLabelFilterString = get(mobxStore, `${treeName}.nodeLabelFilter.ap`)
  const apFilter = get(mobxStore, `${treeName}.apFilter`)

  let apNodes = aps
    // only show if parent node exists
    .filter(el => projNodeIds.includes(el.projId))
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
    .filter(node => filterNodesByApFilter({ node, apFilter }))
    // filter by nodeFilter
    .filter(node =>
      filterNodesByNodeFilterArray({
        node,
        nodeFilterArray,
        table: 'ap',
      }),
    )
  /**
   * There is something weird happening when filtering data
   * that leads to duplicate nodes
   * Need to solve that but in the meantime use uniqBy
   */
  apNodes = uniqBy(apNodes, 'id')
  const apNodesLength = apNodes.length
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
