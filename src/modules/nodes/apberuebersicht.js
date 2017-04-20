// @flow
import findIndex from 'lodash/findIndex'

export default (store: Object, tree: Object, projId: number): Array<Object> => {
  // check passed variables
  if (!store) return store.listError(new Error('no store passed'))
  if (!tree) return store.listError(new Error('no tree passed'))
  if (!projId) return store.listError(new Error('no projId passed'))

  // fetch sorting indexes of parents
  const projIndex = findIndex(tree.filteredAndSorted.projekt, {
    ProjId: projId
  })

  // map through all projekt and create array of nodes
  return tree.filteredAndSorted.apberuebersicht
    .filter(n => n.ProjId === projId)
    .map((el, index) => ({
      nodeType: `table`,
      menuType: `apberuebersicht`,
      id: el.JbuJahr,
      parentId: el.ProjId,
      urlLabel: el.JbuJahr,
      label: el.JbuJahr,
      url: [`Projekte`, el.ProjId, `AP-Berichte`, el.JbuJahr],
      sort: [projIndex, 2, el.JbuJahr],
      hasChildren: false
    }))
}
