/**
 * gets nodes and a path
 * finds the node that has same nodeId as first path element
 * if path contains more elements, recursively calls itself
 * returns found node
 * or null if path contains no elements
 */

const getNodeByPath = (nodes, path) => {
  if (path.length === 0) {
    return
  }
  const el = path.shift()
  const nodeId = (
    el.folder ?
    `${el.table}/${el.id}/${el.folder}` :
    `${el.table}/${el.id}`
  )
  const node = nodes.find(n => n.nodeId === nodeId)
  if (path.length > 0 && node.children) {
    return getNodeByPath(node.children, path)
  }
  return node
}

export default getNodeByPath
