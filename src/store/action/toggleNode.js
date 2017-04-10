// @flow

export default (store: Object, node: Object) => {
  if (node) {
    const newActiveNodeArray = node.url
    if (node.expanded) {
      newActiveNodeArray.pop()
    }
    store.tree.setActiveNodeArray(newActiveNodeArray)
    node.expanded = !node.expanded
  }
}
