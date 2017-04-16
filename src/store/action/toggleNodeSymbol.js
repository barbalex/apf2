// @flow

export default (store: Object, node: Object) => {
  console.log('toggling node symbol')
  if (node) {
    node.expanded = !node.expanded
  }
}
