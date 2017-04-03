export default (store) => {
  const { table, tree } = store
  const { activeNodes } = tree
  // grab assozart as array and sort them by year
  let idealbiotop = Array.from(table.idealbiotop.values())
  // show only nodes of active ap
  idealbiotop = idealbiotop.filter(a => a.IbApArtId === activeNodes.ap)
  return idealbiotop
}
