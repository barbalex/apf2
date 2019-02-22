// @flow
import findIndex from 'lodash/findIndex'
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'
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
  const apbers = get(data, 'allApbers.nodes', [])
  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, { id: apId })
  const nodeLabelFilterString = get(
    mobxStore,
    `${treeName}.nodeLabelFilter.apber`,
  )

  // map through all elements and create array of nodes
  let nodes = memoizeOne(() =>
    apbers
      // only show if parent node exists
      .filter(el =>
        nodesPassed.map(n => n.id).includes(`${el.apId}ApberFolder`),
      )
      // only show nodes of this parent
      .filter(el => el.apId === apId)
      // filter by nodeLabelFilter
      .filter(el => {
        if (nodeLabelFilterString) {
          const jahr = el.jahr || '(kein Jahr)'
          return jahr.toString().includes(nodeLabelFilterString.toLowerCase())
        }
        return true
      })
      .map(el => ({
        nodeType: 'table',
        menuType: 'apber',
        filterTable: 'apber',
        id: el.id,
        parentId: el.apId,
        parentTableId: el.apId,
        urlLabel: el.id,
        label: el.jahr || '(kein Jahr)',
        url: [
          'Projekte',
          projId,
          'Aktionspläne',
          el.apId,
          'AP-Berichte',
          el.id,
        ],
        hasChildren: false,
      }))
      .map((el, index) => {
        el.sort = [projIndex, 1, apIndex, 4, index]
        return el
      }),
  )()

  return sortBy(nodes, 'label')
}
