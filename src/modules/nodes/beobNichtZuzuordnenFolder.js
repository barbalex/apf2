// @flow
import findIndex from 'lodash/findIndex'

export default (
  store: Object,
  tree: Object,
  projId: number,
  apId: number
): Array<Object> => {
  // fetch sorting indexes of parents
  const projIndex = findIndex(tree.filteredAndSorted.projekt, {
    ProjId: projId,
  })
  const apIndex = findIndex(
    tree.filteredAndSorted.ap.filter(a => a.proj_id === projId),
    { id: apId }
  )

  const apArten = Array.from(store.table.apart.values())
    .filter(v => v.ap_id === apId)
    .map(v => v.art_id)

  const beobNichtZuzuordnenNodesLength = tree.filteredAndSorted.beobNichtZuzuordnen.filter(
    b => apArten.includes(b.art_id)
  ).length

  let message = beobNichtZuzuordnenNodesLength
  if (store.loading.includes('tpopbeob')) {
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
        'Arten',
        apId,
        'nicht-zuzuordnende-Beobachtungen',
      ],
      sort: [projIndex, 1, apIndex, 10],
      hasChildren: beobNichtZuzuordnenNodesLength > 0,
    },
  ]
}
