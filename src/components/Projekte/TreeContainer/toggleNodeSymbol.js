import isEqual from 'lodash/isEqual'

import isNodeOpen from './isNodeOpen'

export default ({ treeName, node, store }) => {
  if (!node.url) throw new Error('passed node has no url')
  const { openNodes, setOpenNodes } = store[treeName]

  let newOpenNodes = [...openNodes]
  if (isNodeOpen(openNodes, node.url)) {
    newOpenNodes = newOpenNodes.filter(n => !isEqual(n, node.url))
  } else {
    newOpenNodes.push(node.url)
  }
  setOpenNodes(newOpenNodes)
}
