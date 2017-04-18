// @flow

export default tree => {
  const openNodes = []
  tree.activeNodeArray.forEach((n, index) =>
    openNodes.push(tree.activeNodeArray.slice(0, index + 1))
  )
  return openNodes
}
