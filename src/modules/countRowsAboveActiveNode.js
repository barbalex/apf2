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

let globalCounter

const addExpandedChildren = (node) => {
  if (node && node.children && node.children.length && node.expanded) {
    globalCounter += node.children.length
    node.children.forEach(child => addExpandedChildren(child))
  }
}

const findActiveNodeInNodes = (store, nodes, nodeIdPathPassed) => {
  if (!nodes) return
  const nodeIdPath = nodeIdPathPassed.slice(0)
  const nodeId = nodeIdPath.shift()
  const activeNodesIndex = findIndex(nodes, n => n.id === nodeId)
  const activeNode = nodes[activeNodesIndex]
  if (activeNodesIndex > -1) {
    globalCounter += activeNodesIndex + 1
    for (let i = 0; i < activeNodesIndex; i += 1) {
      addExpandedChildren(nodes[i])
    }
    if (nodeIdPath.length > 0) {
      if (activeNode.children && activeNode.children.length > 0 && activeNode.expanded) {
        findActiveNodeInNodes(activeNode.children, nodeIdPath)
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
  // get nodeIdPath from url, filtering only numbers and guids
  const nodeIdPath = store.url.filter(el =>
    Joi.validate(
      el,
      Joi.alternatives()
        .try(
          Joi.number()
            .integer()
            .min(-2147483648)
            .max(+2147483647),
            Joi.string()
              .guid()
        )
    )
  )
  findActiveNodeInNodes(store, nodes, nodeIdPath)
  // seems like this is always one too much
  if (globalCounter > 1) return globalCounter - 1
  return 0
}
