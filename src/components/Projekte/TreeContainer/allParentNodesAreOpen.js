// @flow
import isNodeOpen from './isNodeOpen'

export default (
  openNodes: Array<Array<string>>,
  node: Array<string>
): boolean => {
  const parentNodesOpennessArray = []
  const openNodesToUse = openNodes.filter((n) => n[0] === 'Projekte')
  for (let i = 1; i < node.length; i++) {
    parentNodesOpennessArray.push(isNodeOpen(openNodesToUse, node.slice(0, i)))
  }
  console.log('allParentNodesAreOpen:', {node,openNodes,openNodesToUse,parentNodesOpennessArray})
  return !parentNodesOpennessArray.includes(false)
}
