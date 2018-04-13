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
    ProjId: projId,
  })
  const apIndex = findIndex(
    tree.filteredAndSorted.ap.filter(a => a.ProjId === projId),
    { ApArtId: apId }
  )

  return [
    {
      nodeType: 'folder',
      menuType: 'idealbiotopFolder',
      id: apId,
      urlLabel: 'Idealbiotop',
      label: 'Idealbiotop',
      url: ['Projekte', projId, 'Arten', apId, 'Idealbiotop'],
      sort: [projIndex, 1, apIndex, 6],
      hasChildren: false,
    },
  ]
}
