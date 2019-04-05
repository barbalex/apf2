// @flow
import findIndex from 'lodash/findIndex'
import get from 'lodash/get'
import memoizeOne from 'memoize-one'

export default ({
  nodes: nodesPassed,
  data,
  treeName,
  projektNodes,
  apNodes,
  projId,
  apId,
  mobxStore,
}: {
  nodes: Array<Object>,
  data: Object,
  treeName: String,
  projektNodes: Array<Object>,
  apNodes: Array<Object>,
  projId: String,
  apId: String,
  mobxStore: Object,
}): Array<Object> => {
  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, { id: apId })

  // map through all elements and create array of nodes
  const nodes = memoizeOne(() =>
    get(data, 'allPops.nodes', [])
      // only show if parent node exists
      .filter(el => nodesPassed.map(n => n.id).includes(`${el.apId}PopFolder`))
      // only show nodes of this parent
      .filter(el => el.apId === apId)
      .map(el => ({
        nodeType: 'table',
        menuType: 'pop',
        filterTable: 'pop',
        id: el.id,
        parentId: `${el.apId}PopFolder`,
        parentTableId: el.apId,
        urlLabel: el.id,
        label: el.label,
        url: [
          'Projekte',
          projId,
          'Aktionspläne',
          el.apId,
          'Populationen',
          el.id,
        ],
        hasChildren: true,
        nr: el.nr || 0,
      }))
      .map((el, index) => {
        el.sort = [projIndex, 1, apIndex, 1, index]
        return el
      }),
  )()

  return nodes
}
