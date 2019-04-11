export default ({ activeNodeArray, store }) => {
  const openNodes = []
  activeNodeArray.forEach((n, index) =>
    openNodes.push(activeNodeArray.slice(0, index + 1)),
  )
  store.setTreeKey({ value: openNodes, tree: 'tree', key: 'openNodes' })
}
