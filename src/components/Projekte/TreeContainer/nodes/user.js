// @flow
import get from 'lodash/get'
import memoizeOne from 'memoize-one'

export default ({
  nodes: nodesPassed,
  data,
  treeName,
  projektNodes,
  store,
}: {
  nodes: Array<Object>,
  data: Object,
  treeName: String,
  projektNodes: Array<Object>,
  store: Object,
}): Array<Object> => {
  // fetch sorting indexes of parents
  const userIndex = projektNodes.length + 1

  // map through all elements and create array of nodes
  const nodes = memoizeOne(() =>
    get(data, 'allUsers.nodes', [])
      .map(el => ({
        nodeType: 'table',
        menuType: 'user',
        filterTable: 'user',
        id: el.id,
        urlLabel: el.id,
        label: el.label,
        url: ['Benutzer', el.id],
        hasChildren: false,
      }))
      .map((el, index) => {
        el.sort = [userIndex, index]
        return el
      }),
  )()

  return nodes
}
