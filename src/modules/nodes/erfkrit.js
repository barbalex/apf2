// @flow
import findIndex from 'lodash/findIndex'

export default (
  store: Object,
  tree: Object,
  projId: number,
  apArtId: number
): Array<Object> => {
  // check passed variables
  if (!store) return store.listError(new Error('no store passed'))
  if (!tree) return store.listError(new Error('no tree passed'))
  if (!apArtId) return store.listError(new Error('no apArtId passed'))
  if (!projId) return store.listError(new Error('no projId passed'))

  // fetch sorting indexes of parents
  const projIndex = findIndex(tree.filteredAndSorted.projekt, {
    ProjId: projId
  })
  const apIndex = findIndex(tree.filteredAndSorted.ap, { ApArtId: apArtId })

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
