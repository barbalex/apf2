// @flow
export default (store: Object, tree: Object): Array<Object> =>
  tree.filteredAndSorted.projekt.map((el, index) => ({
    nodeType: 'table',
    menuType: 'projekt',
    id: el.id,
    urlLabel: el.id,
    label: el.name || '(kein Name)',
    url: ['Projekte', el.id],
    sort: [index],
    hasChildren: true,
  }))
