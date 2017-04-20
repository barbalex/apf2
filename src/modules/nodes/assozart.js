// @flow
import findIndex from 'lodash/findIndex'

export default (
  store: Object,
  tree: Object,
  projId: number,
  apArtId: number
): Array<Object> => {
  // fetch sorting indexes of parents
  const projIndex = findIndex(tree.filteredAndSorted.projekt, {
    ProjId: projId
  })
  const apIndex = findIndex(
    tree.filteredAndSorted.ap.filter(a => a.ProjId === projId),
    { ApArtId: apArtId }
  )

  return tree.filteredAndSorted.assozart
    .filter(p => p.AaApArtId === apArtId)
    .map((el, index) => ({
      nodeType: `table`,
      menuType: `assozart`,
      id: el.AaId,
      parentId: apArtId,
      urlLabel: el.AaId,
      label: el.label,
      url: [`Projekte`, projId, `Arten`, apArtId, `assoziierte-Arten`, el.AaId],
      sort: [projIndex, 1, apIndex, 7, index],
      hasChildren: false
    }))
}
