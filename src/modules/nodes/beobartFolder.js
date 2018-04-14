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
    tree.filteredAndSorted.ap.filter(a => a.ProjId === projId),
    { ApArtId: apId }
  )

  const beobArtNodesLength = tree.filteredAndSorted.beobart.filter(
    n => n.ap_id === apId
  ).length
  let message = beobArtNodesLength
  if (store.table.beobArtLoading) {
    message = '...'
  }
  if (tree.nodeLabelFilter.get('beobart')) {
    message = `${beobArtNodesLength} gefiltert`
  }

  return [
    {
      nodeType: 'folder',
      menuType: 'beobArtFolder',
      id: apId,
      urlLabel: 'arten-fuer-beobachtungen',
      label: `Arten für Beobachtungen (${message})`,
      url: ['Projekte', projId, 'Arten', apId, 'arten-fuer-beobachtungen'],
      sort: [projIndex, 1, apIndex, 8],
      hasChildren: beobArtNodesLength > 0,
    },
  ]
}
