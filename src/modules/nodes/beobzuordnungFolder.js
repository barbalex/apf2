// @flow
import findIndex from 'lodash/findIndex'

export default (
  store: Object,
  tree: Object,
  projId: number,
  apArtId: number
): Array<Object> => {
  // fetch sorting indexes of parents
  const projIndex = findIndex(tree.filteredAndSorted.projekt, {
    ProjId: projId,
  })
  const apIndex = findIndex(
    tree.filteredAndSorted.ap.filter(a => a.ProjId === projId),
    { ApArtId: apArtId }
  )

  const beobArten = Array.from(store.table.beobart.values())
    .filter(v => v.ApArtId === apArtId)
    .map(ba => ba.TaxonomieId)

  const beobzuordnungNodesLength = tree.filteredAndSorted.beobzuordnung.filter(
    b => beobArten.includes(b.ArtId)
  ).length

  let message = beobzuordnungNodesLength
  if (store.loading.includes('beob')) {
    message = '...'
  }
  if (tree.nodeLabelFilter.get('beobzuordnung')) {
    message = `${beobzuordnungNodesLength} gefiltert`
  }

  return [
    {
      nodeType: 'folder',
      menuType: 'beobzuordnungFolder',
      id: apArtId,
      urlLabel: 'nicht-beurteilte-Beobachtungen',
      label: `Beobachtungen nicht beurteilt (${message})`,
      url: [
        'Projekte',
        projId,
        'Arten',
        apArtId,
        'nicht-beurteilte-Beobachtungen',
      ],
      sort: [projIndex, 1, apIndex, 9],
      hasChildren: beobzuordnungNodesLength > 0,
    },
  ]
}
