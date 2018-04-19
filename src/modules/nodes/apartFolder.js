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
    id: projId,
  })
  const apIndex = findIndex(
    tree.filteredAndSorted.ap.filter(a => a.proj_id === projId),
    { id: apId }
  )

  const apArtNodesLength = tree.filteredAndSorted.apart.filter(
    n => n.ap_id === apId
  ).length
  let message = apArtNodesLength
  if (store.table.apArtLoading) {
    message = '...'
  }
  if (tree.nodeLabelFilter.get('apart')) {
    message = `${apArtNodesLength} gefiltert`
  }

  return [
    {
      nodeType: 'folder',
      menuType: 'apArtFolder',
      id: apId,
      urlLabel: 'AP-Arten',
      label: `AP-Arten (${message})`,
      url: ['Projekte', projId, 'Aktionspläne', apId, 'AP-Arten'],
      sort: [projIndex, 1, apIndex, 7],
      hasChildren: apArtNodesLength > 0,
    },
  ]
}
