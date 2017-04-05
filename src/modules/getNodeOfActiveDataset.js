// @flow
export default (store:Object) => {
  const { activeDataset } = store.tree
  const { table, row } = activeDataset
  const nodes = store[`${table}Nodes`]
  return nodes.find(n => n.row === row)
}
