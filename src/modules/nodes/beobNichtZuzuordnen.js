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

  const apArten = Array.from(store.table.apart.values())
    .filter(v => v.ap_id === apId)
    .map(v => v.art_id)
  // map through all and create array of nodes
  return filteredAndSorted.beobNichtZuzuordnen
    .filter(b => {
      const beob = store.table.beob.get(b.beob_id)
      const artId = beob ? beob.art_id : null
      return !!artId && apArten.includes(artId)
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
