// @flow
// filter by nodeFilter
// TODO: would be much better to filter this in query
// this is done
// but unfortunately query does not immediatly update
export default ({
  node,
  nodeFilterArray,
}: {
  node: Object,
  nodeFilterArray: Array<Object>,
}) => {
  if (nodeFilterArray.length === 0) return true
  return nodeFilterArray.every(([key, value]) => {
    if (node[key] === null || node[key] === undefined) return false
    return node[key]
      .toString()
      .toLowerCase()
      .includes(value.toString().toLowerCase())
  })
}
