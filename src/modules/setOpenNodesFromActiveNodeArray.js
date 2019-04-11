// @flow
export default ({
  activeNodeArray,
  store,
}: {
  activeNodeArray: Array<String>,
  store: Object,
}): void => {
  const openNodes = []
  activeNodeArray.forEach((n, index) =>
    openNodes.push(activeNodeArray.slice(0, index + 1)),
  )
  store.setTreeKey({ value: openNodes, tree: 'tree', key: 'openNodes' })
}
