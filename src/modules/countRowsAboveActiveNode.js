// @flow
import isEqual from 'lodash/isEqual'

let globalCounter
let depth

const findActiveNodeInNodes = (store, nodes, depth) => {
  if (!nodes) return
  const { url } = store
  const urlForThisDepth = url.slice(0, depth)
  let activeNodeIndex
  const activeNode = nodes.find((node, index) => {
    if (isEqual(node.url, urlForThisDepth)) {
      activeNodeIndex = index
      return true
    }
    return false
  })

  if (activeNode) {
    globalCounter += activeNodeIndex + 1
    if (url.length > depth) {
      if (activeNode.children && activeNode.children.length > 0 && activeNode.expanded) {
        findActiveNodeInNodes(store, activeNode.children, depth + 1)
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
  // first url is `Projekte`, 1...
  depth = 2

  findActiveNodeInNodes(store, nodes, depth)
  // seems like this is always one too much
  // if (globalCounter > 1) return globalCounter - 1
  return globalCounter
  // return 0
}
