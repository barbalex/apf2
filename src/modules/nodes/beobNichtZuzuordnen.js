// @flow
import findIndex from 'lodash/findIndex'

export default (
  store: Object,
  tree: Object,
  projId: number,
  apId: number
): Array<Object> => {
  const { filteredAndSorted } = tree

  // fetch sorting indexes of parents
  const projIndex = findIndex(filteredAndSorted.projekt, { ProjId: projId })
  const apIndex = findIndex(
    filteredAndSorted.ap.filter(a => a.proj_id === projId),
    { id: apId }
  )

  // map through all and create array of nodes
  return filteredAndSorted.beobNichtZuzuordnen
    .filter(b => {
      const beob = Array.from(store.table.beob.values()).find(
        beo => beo.id === b.beob_id
      )
      const artId = beob ? beob.ArtId : null
      return artId === apId
    })
    .map((el, index) => {
      const beobId = el.beob_id

      return {
        nodeType: 'table',
        menuType: 'beobNichtZuzuordnen',
        id: beobId,
        parentId: apId,
        urlLabel: beobId,
        label: el.label,
        url: [
          'Projekte',
          projId,
          'Arten',
          apId,
          'nicht-zuzuordnende-Beobachtungen',
          beobId,
        ],
        sort: [projIndex, 1, apIndex, 10, index],
        hasChildren: false,
      }
    })
}
