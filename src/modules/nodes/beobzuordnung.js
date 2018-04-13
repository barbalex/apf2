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
    filteredAndSorted.ap.filter(a => a.ProjId === projId),
    { ApArtId: apId }
  )

  // map through all and create array of nodes
  // filter all included in beobart
  const beobArten = Array.from(store.table.beobart.values())
    .filter(v => v.ApArtId === apId)
    .map(ba => ba.TaxonomieId)
  return filteredAndSorted.beobzuordnung
    .filter(b => beobArten.includes(b.ArtId))
    .map((el, index) => ({
      nodeType: 'table',
      menuType: 'beobzuordnung',
      id: el.id,
      parentId: apId,
      urlLabel: el.id,
      label: el.label,
      url: [
        'Projekte',
        projId,
        'Arten',
        apId,
        'nicht-beurteilte-Beobachtungen',
        el.id,
      ],
      sort: [projIndex, 1, apIndex, 9, index],
      hasChildren: false,
    }))
}
