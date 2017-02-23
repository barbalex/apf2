// for sorting see:
// http://stackoverflow.com/questions/13211709/javascript-sort-array-by-multiple-number-fields
// also: needed to account for elements not having the next array elements
// to be sorted befor those that have
// that is why there is || 0

export default (store) => {
  const { activeUrlElements } = store
  const { projekt, apFolder, apberuebersichtFolder, exporteFolder, apberuebersicht } = store.node.node
  let nodes = projekt
  if (activeUrlElements.projekt) {
    nodes = nodes.concat(apFolder)
  }
  if (activeUrlElements.projekt) {
    nodes = nodes.concat(apberuebersichtFolder)
  }
  if (activeUrlElements.projekt) {
    nodes = nodes.concat(exporteFolder)
  }
  if (activeUrlElements.apberuebersichtFolder) {
    nodes = nodes.concat(apberuebersicht)
  }
  return nodes.sort((a, b) => (
    a.sort[0] - b.sort[0] ||
    (a.sort[1] || 0) - b.sort[1] ||
    (a.sort[2] || 0) - b.sort[2] ||
    (a.sort[3] || 0) - b.sort[3] ||
    (a.sort[4] || 0) - b.sort[4] ||
    (a.sort[5] || 0) - b.sort[5] ||
    (a.sort[6] || 0) - b.sort[6] ||
    (a.sort[7] || 0) - b.sort[7] ||
    (a.sort[8] || 0) - b.sort[8]
  ))
}
