// @flow
import findIndex from 'lodash/findIndex'
import get from 'lodash/get'
import memoizeOne from 'memoize-one'

import compareLabel from './compareLabel'
import filterNodesByNodeFilterArray from '../filterNodesByNodeFilterArray'
import filterNodesByApFilter from '../filterNodesByApFilter'

export default ({
  nodes: nodesPassed,
  data,
  treeName,
  projektNodes,
  projId,
  mobxStore,
}: {
  nodes: Array<Object>,
  data: Object,
  treeName: String,
  projektNodes: Array<Object>,
  projId: String,
  mobxStore: Object,
}): Array<Object> => {
  const nodeFilter = get(mobxStore, `nodeFilter.${treeName}`)
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
  const nodes = memoizeOne(() =>
    aps
      // only show if parent node exists
      .filter(el => nodesPassed.map(n => n.id).includes(el.projId))
      // only show nodes of this parent
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
      .map(el => ({
        nodeType: 'table',
        menuType: 'ap',
        filterTable: 'ap',
        id: el.id,
        parentId: el.projId,
        parentTableId: el.projId,
        urlLabel: el.id,
        label: get(el, 'aeEigenschaftenByArtId.artname', '(keine Art gewählt)'),
        url: ['Projekte', el.projId, 'Aktionspläne', el.id],
        hasChildren: true,
      }))
      // sort by label
      .sort(compareLabel)
      .map((el, index) => {
        el.sort = [projIndex, 1, index]
        return el
      }),
  )()
  return nodes
}
