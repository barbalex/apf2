// @flow
/**
 * idea:
 * use nodeIdPath
 * 1 level: find index of element with nodeId
 * add expanded children of previous elements
 * next level: find index of element with nodeId
 * add expanded children of previous elements
 * ...
 */

import { findIndex } from 'lodash'
import Joi from 'joi-browser'
import isEqual from 'lodash/isEqual'

let globalCounter
let depth

const findActiveNodeInNodes = (store, nodes, depthPassed) => {
  if (!nodes) return
  const { url } = store
  const urlForThisDepth = url.slice(depthPassed)
  let activeNodesIndex
  const activeNode = nodes.find((node, index) => {
    if (isEqual(node.url, urlForThisDepth)) {
      activeNodesIndex = index
      return true
    }
    return false
  })

  if (activeNode) {
    globalCounter += activeNodesIndex + 1
    // remove first element IF
    // children are not folders
    // (because these would have same id)
    // or there are no children
    if (!activeNode.children) {
      nodeIdPath.shift()
    }
    const childrenAreNotFolders = (
      activeNode.children &&
      activeNode.children[0].nodeType !== `folder`
    )
    if (childrenAreNotFolders) {
      nodeIdPath.shift()
    }
    if (nodeIdPath.length > 0) {
      if (activeNode.children && activeNode.children.length > 0 && activeNode.expanded) {
        findActiveNodeInNodes(store, activeNode.children, nodeIdPath)
      } else {
        store.listError(new Error(`nodeIdPath not yet empty but no more children`))  // eslint-disable-line no-console
      }
    }
  } else {
    store.listError(new Error(`nodeId from nodeIdPath not found`))  // eslint-disable-line no-console
  }
}

export default (store:Object) => {
  // if anything goes wrong: return previous count
  const nodes = store.projektNodes
  if (!nodes) return 0
  if (!nodes.length) return 0
  globalCounter = 0
  depth = 1

  findActiveNodeInNodes(store, nodes, depth)
  // seems like this is always one too much
  if (globalCounter > 1) return globalCounter - 1
  return 0
}
