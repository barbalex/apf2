export default (store, tree) => {
  const { table } = store
  // grab assozart as array and sort them by year
  let idealbiotop = Array.from(table.idealbiotop.values())

  return idealbiotop
}
