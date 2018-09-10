// @flow
// filter by nodeFilter
// TODO: would be much better to filter this in query
// this is done
// but unfortunately query does not immediatly update
// TODO:
// if key is of type number or boolean, do not cast to string

import types from '../../../state/nodeFilter/types'

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
  return nodeFilterArray.every(([key, value]) => {
    if (node[key] === null || node[key] === undefined) return false
    if (table && types[table] && types[table][key]) {
      type = types[table][key]
    }
    console.log('filterNodesByNodeFilterArray', {
      table,
      types,
      type,
      node,
      value,
    })
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
