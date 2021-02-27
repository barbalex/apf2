import get from 'lodash/get'
import memoizeOne from 'memoize-one'

const userNodes = ({
  nodes: nodesPassed,
  data,
  treeName,
  projektNodes,
  store,
}) => {
  // fetch sorting indexes of parents
  const userIndex = projektNodes.length + 1

  // map through all elements and create array of nodes
  const nodes = memoizeOne(() =>
    get(data, 'allUsers.nodes', [])
      .map((el) => ({
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

export default userNodes
