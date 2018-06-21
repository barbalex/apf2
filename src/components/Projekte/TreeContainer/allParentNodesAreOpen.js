// @flow
import isNodeOpen from './isNodeOpen'

export default (
  openNodes: Array<Array<String>>,
  nodePassed: Array<String>
): Boolean => {
  const parentNodes = []
  const node = [...nodePassed]
  for (let i = 1; i < node.length; i++) {
    parentNodes.push(node.slice(0, i))
  }
  console.log('allParnetNodesAreOpen:',{parentNodes,nodePassed,openNodes})
  return parentNodes.every(n => isNodeOpen(openNodes, n))
}
