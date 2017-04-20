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

  // map through all erfkrit and create array of nodes
  return tree.filteredAndSorted.erfkrit
    .filter(p => p.ApArtId === apArtId)
    .map((el, index) => ({
      nodeType: `table`,
      menuType: `erfkrit`,
      id: el.ErfkritId,
      parentId: el.ApArtId,
      urlLabel: el.ErfkritId,
      label: el.label,
      url: [
        `Projekte`,
        projId,
        `Arten`,
        el.ApArtId,
        `AP-Erfolgskriterien`,
        el.ErfkritId
      ],
      sort: [projIndex, 1, apIndex, 3, index],
      hasChildren: false
    }))
}
