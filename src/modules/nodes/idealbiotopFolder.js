// @flow
import findIndex from 'lodash/findIndex'

export default (
  store: Object,
  tree: Object,
  projId: number,
  apId: number
): Array<Object> => {
  // fetch sorting indexes of parents
  const projIndex = findIndex(tree.filteredAndSorted.projekt, {
    id: projId,
  })
  const apIndex = findIndex(
    tree.filteredAndSorted.ap.filter(a => a.proj_id === projId),
    { id: apId }
  )

  return [
    {
      nodeType: 'folder',
      menuType: 'idealbiotopFolder',
      id: apId,
      urlLabel: 'Idealbiotop',
      label: 'Idealbiotop',
      url: ['Projekte', projId, 'Aktionspläne', apId, 'Idealbiotop'],
      sort: [projIndex, 1, apIndex, 6],
      hasChildren: false,
    },
  ]
}
