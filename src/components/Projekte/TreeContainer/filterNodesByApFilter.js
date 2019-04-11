// filter by apFilter
// TODO: would be much better to filter this in query
// this is done
// but unfortunately query does not immediatly update
export default ({ node, apFilter }) => {
  if (apFilter) {
    return [1, 2, 3].includes(node.bearbeitung)
  }
  return true
}
