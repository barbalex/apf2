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

  // map through all projekt and create array of nodes
  return tree.filteredAndSorted.ber
    .filter(p => p.ApArtId === apArtId)
    .map((el, index) => ({
      nodeType: `table`,
      menuType: `ber`,
      id: el.BerId,
      parentId: el.ApArtId,
      urlLabel: el.BerId,
      label: el.label,
      url: [`Projekte`, projId, `Arten`, el.ApArtId, `Berichte`, el.BerId],
      sort: [projIndex, 1, apIndex, 5, index],
      hasChildren: false
    }))
}
