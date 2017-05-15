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

  // map through all projekt and create array of nodes
  return tree.filteredAndSorted.apber
    .filter(p => p.ApArtId === apArtId)
    .map((el, index) => ({
      nodeType: 'table',
      menuType: 'apber',
      id: el.JBerId,
      parentId: el.ApArtId,
      urlLabel: el.JBerId,
      label: el.label,
      url: ['Projekte', projId, 'Arten', el.ApArtId, 'AP-Berichte', el.JBerId],
      sort: [projIndex, 1, apIndex, 4, index],
      hasChildren: false,
    }))
}
