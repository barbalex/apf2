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
  store,
}: {
  nodes: Array<Object>,
  data: Object,
  treeName: String,
  projektNodes: Array<Object>,
  apNodes: Array<Object>,
  projId: String,
  apId: String,
  store: Object,
}): Array<Object> => {
  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, { id: apId })

  // map through all elements and create array of nodes
  const nodes = memoizeOne(() =>
    get(data, 'allVApbeobs.nodes', [])
      // only show if parent node exists
      .filter(el =>
        nodesPassed
          .map(n => n.id)
          .includes(`${el.apId}BeobNichtBeurteiltFolder`),
      )
      // only show nodes of this parent
      .filter(el => el.apId === apId)
      .map(el => {
        return {
          nodeType: 'table',
          menuType: 'beobNichtBeurteilt',
          filterTable: 'beob',
          id: el.id,
          parentId: el.apId,
          parentTableId: el.apId,
          urlLabel: el.id,
          label: el.label,
          url: [
            'Projekte',
            projId,
            'Aktionspläne',
            apId,
            'nicht-beurteilte-Beobachtungen',
            el.id,
          ],
          hasChildren: false,
        }
      })
      .map((el, index) => {
        el.sort = [projIndex, 1, apIndex, 10, index]
        return el
      }),
  )()

  return nodes
}
