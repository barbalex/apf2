import findIndex from 'lodash/findIndex'

import allParentNodesAreOpen from '../allParentNodesAreOpen'

const ap = ({ nodes: nodesPassed, data, projektNodes, projId, store }) => {
  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })

  // map through all elements and create array of nodes
  const nodes = (data?.allAps?.nodes ?? [])
    // only show if parent node exists
    .filter(() => nodesPassed.map((n) => n.id).includes(projId))
    .map((el) => ({
      nodeType: 'table',
      menuType: 'ap',
      filterTable: 'ap',
      id: el.id,
      parentId: projId,
      parentTableId: projId,
      urlLabel: el.id,
      label: el.label,
      url: ['Projekte', projId, 'Arten', el.id],
      hasChildren: true,
    }))
    .filter((el) => allParentNodesAreOpen(store.tree.openNodes, el.url))
    .map((el, index) => {
      el.sort = [projIndex, 1, index]
      return el
    })

  return nodes
}

export default ap
