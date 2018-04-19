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
  const projIndex = findIndex(filteredAndSorted.projekt, {
    id: projId,
  })
  const apIndex = findIndex(
    filteredAndSorted.ap.filter(a => a.proj_id === projId),
    { id: apId }
  )

  const apArten = Array.from(store.table.apart.values())
    .filter(v => v.ap_id === apId)
    .map(v => v.art_id)

  const beobNichtZuzuordnenNodesLength = filteredAndSorted.beobNichtZuzuordnen.filter(
    b => !!b.art_id && apArten.includes(b.art_id)
  ).length

  let message = beobNichtZuzuordnenNodesLength
  if (store.loading.includes('beob')) {
    message = '...'
  }
  if (tree.nodeLabelFilter.get('beobNichtZuzuordnen')) {
    message = `${beobNichtZuzuordnenNodesLength} gefiltert`
  }

  return [
    {
      nodeType: 'folder',
      menuType: 'beobNichtZuzuordnenFolder',
      id: apId,
      urlLabel: 'nicht-zuzuordnende-Beobachtungen',
      label: `Beobachtungen nicht zuzuordnen (${message})`,
      url: [
        'Projekte',
        projId,
        'Aktionspläne',
        apId,
        'nicht-zuzuordnende-Beobachtungen',
      ],
      sort: [projIndex, 1, apIndex, 10],
      hasChildren: beobNichtZuzuordnenNodesLength > 0,
    },
  ]
}
