// @flow
import clone from 'lodash/clone'

export default (store: Object, node: Object) => {
  if (node) {
    const newActiveNodeArray = clone(node.url)
    if (node.expanded) {
      newActiveNodeArray.pop()
    }
    store.tree2.setActiveNodeArray(newActiveNodeArray)
    node.expanded = !node.expanded
  }
}
