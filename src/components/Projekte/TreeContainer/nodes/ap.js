import findIndex from 'lodash/findIndex'
import get from 'lodash/get'
import memoizeOne from 'memoize-one'

import allParentNodesAreOpen from '../allParentNodesAreOpen'

const ap = ({
  nodes: nodesPassed,
  data,
  treeName,
  projektNodes,
  projId,
  store,
}) => {
  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })

  // map through all elements and create array of nodes
  const nodes = memoizeOne(() =>
    get(data, 'allAps.nodes', [])
      // only show if parent node exists
      .filter((el) => nodesPassed.map((n) => n.id).includes(el.projId))
      // only show nodes of this parent
      .filter((el) => el.projId === projId)
      .map((el) => ({
        nodeType: 'table',
        menuType: 'ap',
        filterTable: 'ap',
        id: el.id,
        parentId: el.projId,
        parentTableId: el.projId,
        urlLabel: el.id,
        label: el.label,
        url: ['Projekte', el.projId, 'Aktionspläne', el.id],
        hasChildren: true,
      }))
      .filter((el) => allParentNodesAreOpen(store[treeName].openNodes, el.url))
      .map((el, index) => {
        el.sort = [projIndex, 1, index]
        return el
      }),
  )()

  return nodes
}

export default ap
