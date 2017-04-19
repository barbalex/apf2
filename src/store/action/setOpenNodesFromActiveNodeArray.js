// @flow

export default (tree: Object): void => {
  const openNodes = []
  tree.activeNodeArray.forEach((n, index) =>
    openNodes.push(tree.activeNodeArray.slice(0, index + 1))
  )
  tree.openNodes = openNodes
}
