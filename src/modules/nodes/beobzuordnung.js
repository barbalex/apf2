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
  const projIndex = findIndex(filteredAndSorted.projekt, { id: projId })
  const apIndex = findIndex(
    filteredAndSorted.ap.filter(a => a.proj_id === projId),
    { id: apId }
  )

  // map through all and create array of nodes
  // filter all included in apart
  const apArten = Array.from(store.table.apart.values())
    .filter(v => v.ap_id === apId)
    .map(ba => ba.art_id)
  return filteredAndSorted.beobzuordnung
    .filter(b => apArten.includes(b.art_id))
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
