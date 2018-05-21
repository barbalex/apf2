// @flow
import findIndex from 'lodash/findIndex'
import get from 'lodash/get'

export default ({
  data,
  tree,
  projektNodes,
  apNodes,
  projId,
  apId,
}: {
  data: Object,
  tree: Object,
  projektNodes: Array<Object>,
  apNodes: Array<Object>,
  projId: String,
  apId: String,
}): Array<Object> => {
  const pops = get(data, 'pops.nodes', [])
  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, { id: apId })
  const nodeLabelFilterString = get(tree.nodeLabelFilter
    .find(f => f.table === 'pop'), 'value')

  // map through all elements and create array of nodes
  const nodes = pops
    .filter(el => el.apId === apId)
    // filter by nodeLabelFilter
    .filter(el => {
      if (nodeLabelFilterString) {
        return `${el.nr || '(keine Nr)'}: ${el.name || '(kein Name)'}`
          .toLowerCase()
          .includes(nodeLabelFilterString.toLowerCase())
      }
      return true
    })
    .map(el => ({
      nodeType: 'table',
      menuType: 'pop',
      id: el.id,
      parentId: el.apId,
      urlLabel: el.id,
      label: `${el.nr || '(keine Nr)'}: ${el.name || '(kein Name)'}`,
      url: ['Projekte', projId, 'Aktionspläne', el.apId, 'Populationen', el.id],
      hasChildren: true,
      nr: el.nr || 0,
    }))
    // sort again to sort (keine Nr) on top
    .sort((a, b) => a.nr - b.nr)
    .map((el, index) => {
      el.sort = [projIndex, 1, apIndex, 1, index]
      return el
    })

  return nodes
}
