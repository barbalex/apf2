export default (store) => {
  const { activeDataset } = store
  const { table, row } = activeDataset
  const nodes = store[`${table}Nodes`]
  return nodes.find(n => n.row === row)
}
