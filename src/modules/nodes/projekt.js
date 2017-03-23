export default (store) => {
  const { activeUrlElements, table } = store

  // map through all filtered and sorted projekt and create array of nodes
  return table.filteredAndSorted.projekt.map((el, index) => ({
    nodeType: `table`,
    menuType: `projekt`,
    id: el.ProjId,
    label: el.ProjName || `(kein Name)`,
    expanded: el.ProjId === activeUrlElements.projekt,
    url: [`Projekte`, el.ProjId],
    sort: [index],
    level: 1,
    childrenLength: 3,
  }))
}
