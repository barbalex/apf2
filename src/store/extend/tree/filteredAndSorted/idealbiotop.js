export default (store) => {
  const { activeNodes, table } = store
  // grab assozart as array and sort them by year
  let idealbiotop = Array.from(table.idealbiotop.values())
  // show only nodes of active ap
  idealbiotop = idealbiotop.filter(a => a.IbApArtId === activeNodes.ap)
  return idealbiotop
}
