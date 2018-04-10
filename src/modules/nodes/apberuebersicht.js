// @flow
import findIndex from 'lodash/findIndex'

export default (store: Object, tree: Object, projId: number): Array<Object> => {
  // fetch sorting indexes of parents
  const projIndex = findIndex(tree.filteredAndSorted.projekt, {
    ProjId: projId,
  })

  // map through all projekt and create array of nodes
  return tree.filteredAndSorted.apberuebersicht
    .filter(n => n.proj_id === projId)
    .map((el, index) => ({
      nodeType: 'table',
      menuType: 'apberuebersicht',
      id: el.id,
      parentId: el.proj_id,
      urlLabel: el.jahr,
      label: el.jahr,
      url: ['Projekte', el.proj_id, 'AP-Berichte', el.id],
      sort: [projIndex, 2, el.jahr],
      hasChildren: false,
    }))
}
