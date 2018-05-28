// @flow
import isNodeOpen from './isNodeOpen'

export default (
  openNodes: Array<Array<string>>,
  node: Array<string>
): boolean => {
  const parentNodesOpennessArray = []
  for (let i = 1; i < node.length; i++) {
    parentNodesOpennessArray.push(isNodeOpen(openNodes, node.slice(0, i)))
  }
  return !parentNodesOpennessArray.includes(false)
}
