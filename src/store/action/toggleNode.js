// @flow
import clone from 'lodash/clone'

export default (store: Object, tree: Object, node: Object) => {
  if (node) {
    const newActiveNodeArray = clone(node.url)
    if (node.expanded) {
      newActiveNodeArray.pop()
    }
    tree.setActiveNodeArray(newActiveNodeArray)
    node.expanded = !node.expanded
  }
}
