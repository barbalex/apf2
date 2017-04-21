// @flow
import findIndex from 'lodash/findIndex'

export default (
  store: Object,
  tree: Object,
  projId: number,
  apArtId: number
): Array<Object> => {
  const { filteredAndSorted } = tree
  // fetch sorting indexes of parents
  const projIndex = findIndex(filteredAndSorted.projekt, { ProjId: projId })
  const apIndex = findIndex(
    filteredAndSorted.ap.filter(a => a.ProjId === projId),
    { ApArtId: apArtId }
  )

  // map through all and create array of nodes
  return filteredAndSorted.beobzuordnung
    .filter(b => b.ArtId === apArtId)
    .map((el, index) => {
      const beobId = el.BeobId

      return {
        nodeType: `table`,
        menuType: `beobzuordnung`,
        id: beobId,
        parentId: apArtId,
        urlLabel: beobId,
        label: el.label,
        url: [
          `Projekte`,
          projId,
          `Arten`,
          apArtId,
          `nicht-beurteilte-Beobachtungen`,
          beobId
        ],
        sort: [projIndex, 1, apIndex, 8, index],
        hasChildren: false
      }
    })
}
