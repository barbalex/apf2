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

  const assozartNodesLength = tree.filteredAndSorted.assozart.filter(
    n => n.ap_id === apId
  ).length
  let message = assozartNodesLength
  if (store.table.assozartLoading) {
    message = '...'
  }
  if (tree.nodeLabelFilter.get('assozart')) {
    message = `${assozartNodesLength} gefiltert`
  }

  return [
    {
      nodeType: 'folder',
      menuType: 'assozartFolder',
      id: apId,
      urlLabel: 'assoziierte-Arten',
      label: `assoziierte Arten (${message})`,
      url: ['Projekte', projId, 'Arten', apId, 'assoziierte-Arten'],
      sort: [projIndex, 1, apIndex, 8],
      hasChildren: assozartNodesLength > 0,
    },
  ]
}
