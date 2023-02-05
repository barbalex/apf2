import isNodeOpen from '../isNodeOpen'
import openNode from '../openNode'

const toggleNode = ({ node, store, navigate, search }) => {
  if (!node.data.url) throw new Error('passed node has no url')
  const { openNodes, activeNodeArray, setLastTouchedNode } = store.tree

  let newActiveNodeArray = []
  if (!isNodeOpen({ openNodes, url: node.data.url })) {
    // node is closed
    // open it and make it the active node
    openNode({ node, openNodes, store })
    newActiveNodeArray = [...node.data.url]
    // some elements are numbers but they are contained in url as text
    // eslint-disable-next-line eqeqeq
  } else if (node.data.urlLabel == activeNodeArray.slice(-1)[0]) {
    // the node is open
    // AND it is the active node
    // make it's parent the new active node
    newActiveNodeArray = [...node.data.url]
    newActiveNodeArray.pop()
  } else {
    // the node is open
    // but not the active node
    // make it the new active node
    newActiveNodeArray = [...node.data.url]
  }
  navigate(`/Daten/${newActiveNodeArray.join('/')}${search}`)
  setLastTouchedNode(node.data.url)
}

export default toggleNode
