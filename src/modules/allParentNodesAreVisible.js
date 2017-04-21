// @flow
import isEqual from 'lodash/isEqual'

export default (
  nodes: Array<Object>,
  nodeUrl: Array<string | number>
): boolean => {
  const parentNodesUrlArray = []
  for (let i = 3; i <= nodeUrl.length; i++) {
    parentNodesUrlArray.push(nodeUrl.slice(0, i))
  }
  // find all parent nodes
  // return false if one is not found
  let allParentNodesAreVisible = true
  parentNodesUrlArray.forEach(url => {
    const parentNode = nodes.find(node => isEqual(node.url, url))
    if (!parentNode) {
      allParentNodesAreVisible = false
    }
  })
  return allParentNodesAreVisible
}
