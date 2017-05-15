// @flow
import findIndex from 'lodash/findIndex'

export default (
  store: Object,
  tree: Object,
  projId: number,
  apArtId: number,
): Array<Object> => {
  // fetch sorting indexes of parents
  const projIndex = findIndex(tree.filteredAndSorted.projekt, {
    ProjId: projId,
  })
  const apIndex = findIndex(
    tree.filteredAndSorted.ap.filter(a => a.ProjId === projId),
    { ApArtId: apArtId },
  )

  return [
    {
      nodeType: 'folder',
      menuType: 'idealbiotopFolder',
      id: apArtId,
      urlLabel: 'Idealbiotop',
      label: 'Idealbiotop',
      url: ['Projekte', projId, 'Arten', apArtId, 'Idealbiotop'],
      sort: [projIndex, 1, apIndex, 6],
      hasChildren: false,
    },
  ]
}
