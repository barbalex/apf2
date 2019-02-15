// @flow
// filter by nodeFilter

import types from '../../../mobxStore/NodeFilterTree/simpleTypes'

export default ({
  node,
  nodeFilterArray,
  table,
}: {
  node: Object,
  nodeFilterArray: Array<Object>,
  table: string,
}) => {
  if (nodeFilterArray.length === 0) return true
  let type = 'string'
  console.log('filterNodesByNodeFilterArray:', { types, nodeFilterArray, node })
  return nodeFilterArray.every(([key, value]) => {
    if (node[key] === null || node[key] === undefined) return false
    if (table && types[table] && types[table][key]) {
      type = types[table][key]
    }
    console.log('filterNodesByNodeFilterArray:', { key, value, type })
    if (['number', 'uuid', 'boolean'].includes(type)) {
      // eslint-disable-next-line eqeqeq
      return node[key] == value
    }
    // must be string or date
    return node[key]
      .toString()
      .toLowerCase()
      .includes(value.toString().toLowerCase())
  })
}
