import findIndex from 'lodash/findIndex'
import get from 'lodash/get'
import memoizeOne from 'memoize-one'

import allParentNodesAreOpen from '../allParentNodesAreOpen'
import allParentNodesExist from '../allParentNodesExist'

export default ({
  nodes: nodesPassed,
  data,
  treeName,
  projektNodes,
  apNodes,
  openNodes,
  projId,
  apId,
  zielJahr,
  zielId,
  apzieljahrFolderNodes,
  apzielNodes,
  store,
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
    el => el.jahr === zielJahr,
  )
  const zielIndex = findIndex(apzielNodes, el => el.id === zielId)

  // map through all elements and create array of nodes
  const nodes = memoizeOne(() =>
    get(data, 'allZielbers.nodes', [])
      .filter(el => el.zielId === zielId)
      .map(el => ({
        nodeType: 'table',
        menuType: 'zielber',
        filterTable: 'zielber',
        id: el.id,
        parentId: el.zielId,
        parentTableId: el.zielId,
        urlLabel: el.id,
        label: el.label,
        url: [
          'Projekte',
          projId,
          'Aktionspläne',
          apId,
          'AP-Ziele',
          zielJahr,
          el.zielId,
          'Berichte',
          el.id,
        ],
        hasChildren: false,
      }))
      .filter(el => allParentNodesAreOpen(openNodes, el.url))
      .filter(n => allParentNodesExist(nodesPassed, n))
      .map((el, index) => {
        el.sort = [projIndex, 1, apIndex, 2, zieljahrIndex, zielIndex, 1, index]
        return el
      }),
  )()

  return nodes
}
