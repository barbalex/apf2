// @flow
import isNodeOpen from './isNodeOpen'

export default (
  openNodes: Array<Array<String>>,
  nodePassed: Array<String>
): Boolean => {
  let parentNodes = []
  const node = [...nodePassed]
  for (let i = 1; i < node.length; i++) {
    parentNodes.push(node.slice(0, i))
  }
  // remove 'Projekte' as that is not contained in openNodes
  parentNodes = parentNodes.filter(n => !(n.length === 1 && n[0] === 'Projekte'))
  if (parentNodes.length === 0) return true
  return parentNodes.every(n => isNodeOpen(openNodes, n))
}
