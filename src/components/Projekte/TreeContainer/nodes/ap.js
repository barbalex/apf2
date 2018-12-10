// @flow
import findIndex from 'lodash/findIndex'
import get from 'lodash/get'

import compareLabel from './compareLabel'
import allParentNodesExist from '../allParentNodesExist'
import filterNodesByNodeFilterArray from '../filterNodesByNodeFilterArray'
import filterNodesByApFilter from '../filterNodesByApFilter'

export default ({
  nodes: nodesPassed,
  data,
  treeName,
  projektNodes,
  projId,
  nodeFilter,
  mobxStore,
}: {
  nodes: Array<Object>,
  data: Object,
  treeName: String,
  projektNodes: Array<Object>,
  projId: String,
  nodeFilter: Object,
  mobxStore: Object,
}): Array<Object> => {
  const apFilter = get(mobxStore, `${treeName}.apFilter`)
  const nodeLabelFilterString = get(mobxStore, `${treeName}.nodeLabelFilter.ap`)
  const aps = get(data, 'allAps.nodes', [])
  const nodeFilterArray = Object.entries(nodeFilter.ap).filter(
    ([key, value]) => value || value === 0 || value === false,
  )

  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })

  // map through all elements and create array of nodes
  const nodes = aps
    // filter by projekt
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
    // TODO: would be much better to filter this in query
    // this is done
    // but unfortunately query does not immediatly update
    .filter(node => filterNodesByApFilter({ node, apFilter }))
    // filter by nodeFilter
    // TODO: would be much better to filter this in query
    // this is done
    // but unfortunately query does not immediatly update
    .filter(node =>
      filterNodesByNodeFilterArray({
        node,
        nodeFilterArray,
        table: 'ap',
      }),
    )
    .map(el => ({
      nodeType: 'table',
      menuType: 'ap',
      filterTable: 'ap',
      id: el.id,
      parentId: el.projId,
      urlLabel: el.id,
      label: get(el, 'aeEigenschaftenByArtId.artname', '(keine Art gewählt)'),
      url: ['Projekte', el.projId, 'Aktionspläne', el.id],
      hasChildren: true,
    }))
    .filter(n => allParentNodesExist(nodesPassed, n))
    // sort by label
    .sort(compareLabel)
    .map((el, index) => {
      el.sort = [projIndex, 1, index]
      return el
    })
  return nodes
}
