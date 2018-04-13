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

  const erfkritNodesLength = tree.filteredAndSorted.erfkrit.filter(
    n => n.ap_id === apId
  ).length

  let message = erfkritNodesLength
  if (store.table.erfkritLoading) {
    message = '...'
  }
  if (tree.nodeLabelFilter.get('erfkrit')) {
    message = `${erfkritNodesLength} gefiltert`
  }

  return [
    {
      nodeType: 'folder',
      menuType: 'erfkritFolder',
      id: apId,
      urlLabel: 'AP-Erfolgskriterien',
      label: `AP-Erfolgskriterien (${message})`,
      url: ['Projekte', projId, 'Arten', apId, 'AP-Erfolgskriterien'],
      sort: [projIndex, 1, apIndex, 3],
      hasChildren: erfkritNodesLength > 0,
    },
  ]
}
