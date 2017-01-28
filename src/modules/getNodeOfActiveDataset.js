// @flow
export default (store:Object) => {
  const { activeDataset } = store
  const { table, row } = activeDataset
  const nodes = store[`${table}Nodes`]
  return nodes.find(n => n.row === row)
}
