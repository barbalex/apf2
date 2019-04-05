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
  popNodes,
  tpopNodes,
  projId,
  apId,
  popId,
  tpopId,
  mobxStore,
}: {
  nodes: Array<Object>,
  data: Object,
  treeName: String,
  projektNodes: Array<Object>,
  apNodes: Array<Object>,
  popNodes: Array<Object>,
  tpopNodes: Array<Object>,
  projId: String,
  apId: String,
  popId: String,
  tpopId: String,
  mobxStore: Object,
}): Array<Object> => {
  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, { id: apId })
  const popIndex = findIndex(popNodes, { id: popId })
  const tpopIndex = findIndex(tpopNodes, { id: tpopId })

  // map through all elements and create array of nodes
  const nodes = memoizeOne(() =>
    get(data, 'allVApbeobs.nodes', [])
      // only show if parent node exists
      .filter(el =>
        nodesPassed.map(n => n.id).includes(`${el.tpopId}BeobZugeordnetFolder`),
      )
      // only show nodes of this parent
      .filter(el => el.tpopId === tpopId)
      .map((el, index) => {
        return {
          nodeType: 'table',
          menuType: 'beobZugeordnet',
          filterTable: 'beob',
          id: el.id,
          parentId: `${el.tpopId}BeobZugeordnetFolder`,
          parentTableId: el.tpopId,
          urlLabel: el.id,
          label: el.label,
          url: [
            'Projekte',
            projId,
            'Aktionspläne',
            apId,
            'Populationen',
            popId,
            'Teil-Populationen',
            tpopId,
            'Beobachtungen',
            el.id,
          ],
          hasChildren: false,
        }
      })
      .map((el, index) => {
        el.sort = [projIndex, 1, apIndex, 1, popIndex, 1, tpopIndex, 6, index]
        return el
      }),
  )()

  return nodes
}
