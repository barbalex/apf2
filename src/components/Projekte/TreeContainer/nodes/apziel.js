import findIndex from 'lodash/findIndex'

import allParentNodesAreOpen from '../allParentNodesAreOpen'
import allParentNodesExist from '../allParentNodesExist'

const apzielNodes = ({
  nodes: nodesPassed,
  data,
  projektNodes,
  apNodes,
  openNodes,
  projId,
  apId,
  jahr,
  apzieljahrFolderNodes,
}) => {
  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, {
    id: apId,
  })
  const zieljahrIndex = findIndex(
    apzieljahrFolderNodes,
    (el) => el.jahr === jahr,
  )

  // map through all elements and create array of nodes
  const nodes = (data?.allZiels?.nodes ?? [])
    .filter((el) => el.apId === apId)
    .filter((el) => el.jahr === jahr)
    .map((el) => ({
      nodeType: 'table',
      menuType: 'ziel',
      filterTable: 'ziel',
      id: el.id,
      parentId: el.apId,
      parentTableId: el.apId,
      urlLabel: el.id,
      label: el.label,
      url: ['Projekte', projId, 'Arten', el.apId, 'AP-Ziele', el.jahr, el.id],
      hasChildren: true,
    }))
    .filter((el) => allParentNodesAreOpen(openNodes, el.url))
    .filter((n) => allParentNodesExist(nodesPassed, n))
    .map((el, index) => {
      el.sort = [projIndex, 1, apIndex, 2, zieljahrIndex, index]
      return el
    })

  return nodes
}

export default apzielNodes
