export default (store, tree) => {
  const { filteredAndSorted } = tree

  return filteredAndSorted.projekt.map((el, index) => ({
    nodeType: `table`,
    menuType: `projekt`,
    id: el.ProjId,
    urlLabel: el.ProjId,
    label: el.ProjName || `(kein Name)`,
    url: [`Projekte`, el.ProjId],
    sort: [index],
    hasChildren: true
  }))
}
