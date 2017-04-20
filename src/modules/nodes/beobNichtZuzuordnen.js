import findIndex from 'lodash/findIndex'

export default (store, tree, projId, apArtId) => {
  // check passed variables
  if (!store) return store.listError(new Error('no store passed'))
  if (!tree) return store.listError(new Error('no tree passed'))
  if (!apArtId) return store.listError(new Error('no apArtId passed'))
  if (!projId) return store.listError(new Error('no projId passed'))

  const { filteredAndSorted } = tree
  // fetch sorting indexes of parents
  const projIndex = findIndex(filteredAndSorted.projekt, { ProjId: projId })
  const apIndex = findIndex(filteredAndSorted.ap, { ApArtId: apArtId })

  // map through all and create array of nodes
  return filteredAndSorted.beobNichtZuzuordnen
    .filter(b => b.NO_ISFS === apArtId)
    .map((el, index) => {
      const beobId = isNaN(el.NO_NOTE) ? el.NO_NOTE : parseInt(el.NO_NOTE, 10)

      return {
        nodeType: `table`,
        menuType: `beobNichtZuzuordnen`,
        id: beobId,
        parentId: apArtId,
        urlLabel: beobId,
        label: el.label,
        url: [
          `Projekte`,
          projId,
          `Arten`,
          apArtId,
          `nicht-zuzuordnende-Beobachtungen`,
          beobId
        ],
        sort: [projIndex, 1, apIndex, 9, index],
        hasChildren: false
      }
    })
}
