export default (store, tree) =>
  tree.filteredAndSorted.projekt.map((el, index) => ({
    nodeType: `table`,
    menuType: `projekt`,
    id: el.ProjId,
    label: el.ProjName || `(kein Name)`,
    expanded: el.ProjId === tree.activeNodes.projekt,
    url: [`Projekte`, el.ProjId],
    sort: [index],
    hasChildren: true,
  }))
