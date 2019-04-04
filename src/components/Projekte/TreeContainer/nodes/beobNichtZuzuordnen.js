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
  openNodes,
  projId,
  apId,
  mobxStore,
}: {
  nodes: Array<Object>,
  data: Object,
  treeName: String,
  projektNodes: Array<Object>,
  apNodes: Array<Object>,
  openNodes: Array<String>,
  projId: String,
  apId: String,
  mobxStore: Object,
}): Array<Object> => {
  const beobNichtZuzuordnens = get(data, 'allVApbeobs.nodes', [])
  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, { id: apId })
  const nodeLabelFilterString =
    get(mobxStore, `${treeName}.nodeLabelFilter.beob`) || ''

  // map through all elements and create array of nodes
  const nodes = memoizeOne(() =>
    beobNichtZuzuordnens
      // only show if parent node exists
      .filter(el =>
        nodesPassed
          .map(n => n.id)
          .includes(`${el.apId}BeobNichtZuzuordnenFolder`),
      )
      // only show nodes of this parent
      .filter(el => el.apId === apId)
      // filter by nodeLabelFilter
      .filter(el => {
        if (nodeLabelFilterString) {
          return el.label
            .toLowerCase()
            .includes(nodeLabelFilterString.toLowerCase())
        }
        return true
      })
      .map(el => {
        return {
          nodeType: 'table',
          menuType: 'beobNichtZuzuordnen',
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
            'nicht-zuzuordnende-Beobachtungen',
            el.id,
          ],
          hasChildren: false,
        }
      })
      .map((el, index) => {
        el.sort = [projIndex, 1, apIndex, 11, index]
        return el
      }),
  )()

  return nodes
}
