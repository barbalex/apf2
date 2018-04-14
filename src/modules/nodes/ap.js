// @flow
import findIndex from 'lodash/findIndex'

export default (store: Object, tree: Object, projId: number): Array<Object> => {
  // fetch sorting indexes of parents
  const projIndex = findIndex(tree.filteredAndSorted.projekt, {
    ProjId: projId,
  })

  // map through all pop and create array of nodes
  return tree.filteredAndSorted.ap
    .filter(n => n.proj_id === projId)
    .map((el, index) => ({
      nodeType: 'table',
      menuType: 'ap',
      id: el.id,
      parentId: el.proj_id,
      urlLabel: el.id,
      label: el.label,
      url: ['Projekte', el.proj_id, 'Arten', el.id],
      sort: [projIndex, 1, index],
      hasChildren: true,
    }))
}
