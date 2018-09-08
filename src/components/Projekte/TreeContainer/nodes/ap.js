// @flow
import findIndex from 'lodash/findIndex'
import get from 'lodash/get'

import compareLabel from './compareLabel'
import allParentNodesExist from '../allParentNodesExist'
import filterNodesByNodeFilterArray from '../filterNodesByNodeFilterArray'
import filterNodesByApFilter from '../filterNodesByApFilter'
import filterExistsBelowAp from '../../../../modules/filterExistsBelowAp'
import popOrLowerIsFiltered from '../../../../modules/popOrLowerIsFiltered'

export default ({
  nodes: nodesPassed,
  data,
  treeName,
  projektNodes,
  projId,
  nodeFilterState,
}: {
  nodes: Array<Object>,
  data: Object,
  treeName: String,
  projektNodes: Array<Object>,
  projId: String,
  nodeFilterState: Object,
}): Array<Object> => {
  const nodeFilter = nodeFilterState.state[treeName]
  const apFilter = get(data, `${treeName}.apFilter`)
  const nodeLabelFilterString = get(data, `${treeName}.nodeLabelFilter.ap`)
  const aps = get(data, 'aps.nodes', [])
  const nodeFilterArray = Object.entries(nodeFilter.ap).filter(
    ([key, value]) => value || value === 0,
  )

  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const _filterExistsBelowAp = filterExistsBelowAp({
    nodeFilterState,
    treeName,
  })
  const _popOrLowerIsFiltered = popOrLowerIsFiltered({
    nodeFilterState,
    treeName,
  })
  const apIdsOfOwnPops = _popOrLowerIsFiltered
    ? nodesPassed.filter(n => n.table === 'pop').map(n => n.id)
    : null
  console.log('nodes, ap:', { apIdsOfOwnPops, nodesPassed })

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
    .filter(node => filterNodesByNodeFilterArray({ node, nodeFilterArray }))
    .filter(node => {
      /**
       * TODO
       * if has no tpop
       * and tpop are filtered
       * do not return
       */
      if (_filterExistsBelowAp) {
        if (apIdsOfOwnPops && apIdsOfOwnPops.length) {
          // TODO
          // filter pop in nodesPassed
          // return only ap of those pop
          // DOES NOT WORK
          // because pop nodes do not yet exist as their data was not fetched yet
          return apIdsOfOwnPops.includes(node.id)
        }
        return true
      }
      return true
    })
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
