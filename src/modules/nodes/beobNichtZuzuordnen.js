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

  const apArten = Array.from(store.table.apart.values())
    .filter(v => v.ap_id === apId)
    .map(v => v.art_id)
  // map through all and create array of nodes
  return filteredAndSorted.beobNichtZuzuordnen
    .filter(b => !!b.art_id && apArten.includes(b.art_id))
    .map((el, index) => ({
      nodeType: 'table',
      menuType: 'beobNichtZuzuordnen',
      id: el.id,
      parentId: apId,
      urlLabel: el.id,
      label: el.label,
      url: [
        'Projekte',
        projId,
        'Aktionspläne',
        apId,
        'nicht-zuzuordnende-Beobachtungen',
        el.id,
      ],
      sort: [projIndex, 1, apIndex, 10, index],
      hasChildren: false,
    }))
}
