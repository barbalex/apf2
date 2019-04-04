// @flow
import get from 'lodash/get'
import memoizeOne from 'memoize-one'

export default ({
  nodes: nodesPassed,
  data,
  treeName,
  projektNodes,
  mobxStore,
}: {
  nodes: Array<Object>,
  data: Object,
  treeName: String,
  projektNodes: Array<Object>,
  mobxStore: Object,
}): Array<Object> => {
  const nodeLabelFilterString =
    get(mobxStore, `${treeName}.nodeLabelFilter.user`) || ''
  const users = get(data, 'allUsers.nodes', [])

  // fetch sorting indexes of parents
  const userIndex = projektNodes.length + 1

  // map through all elements and create array of nodes
  const nodes = memoizeOne(() =>
    users
      // filter by nodeLabelFilter
      .filter(el => {
        if (nodeLabelFilterString) {
          return el.label
            .toLowerCase()
            .includes(nodeLabelFilterString.toLowerCase())
        }
        return true
      })
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
