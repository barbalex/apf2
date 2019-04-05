// @flow
export default ({
  activeNodeArray,
  mobxStore,
}: {
  activeNodeArray: Array<String>,
  mobxStore: Object,
}): void => {
  const openNodes = []
  activeNodeArray.forEach((n, index) =>
    openNodes.push(activeNodeArray.slice(0, index + 1)),
  )
  mobxStore.setTreeKey({ value: openNodes, tree: 'tree', key: 'openNodes' })
}
