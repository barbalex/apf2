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
  // filter all included in beob_art
  const beobArten = Array.from(store.table.beob_art.values())
    .filter(v => v.ApArtId === apArtId)
    .map(ba => ba.TaxonomieId)
  return filteredAndSorted.beobzuordnung
    .filter(b => beobArten.includes(b.ArtId))
    .map((el, index) => ({
      nodeType: 'table',
      menuType: 'beobzuordnung',
      id: el.id,
      parentId: apArtId,
      urlLabel: el.id,
      label: el.label,
      url: [
        'Projekte',
        projId,
        'Arten',
        apArtId,
        'nicht-beurteilte-Beobachtungen',
        el.id,
      ],
      sort: [projIndex, 1, apIndex, 8, index],
      hasChildren: false,
    }))
}
