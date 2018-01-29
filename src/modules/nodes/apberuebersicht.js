// @flow
import findIndex from 'lodash/findIndex'

export default (store: Object, tree: Object, projId: number): Array<Object> => {
  // fetch sorting indexes of parents
  const projIndex = findIndex(tree.filteredAndSorted.projekt, {
    ProjId: projId,
  })

  // map through all projekt and create array of nodes
  return tree.filteredAndSorted.apberuebersicht
    .filter(n => n.ProjId === projId)
    .map((el, index) => ({
      nodeType: 'table',
      menuType: 'apberuebersicht',
      id: el.JbuJahr,
      parentId: el.ProjId,
      urlLabel: el.JbuJahr,
      label: el.JbuJahr,
      url: ['Projekte', el.ProjId, 'AP-Berichte', el.id],
      sort: [projIndex, 2, el.JbuJahr],
      hasChildren: false,
    }))
}
