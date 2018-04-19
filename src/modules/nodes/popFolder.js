// @flow
import findIndex from 'lodash/findIndex'

export default (
  store: Object,
  tree: Object,
  projId: number,
  apId: number
): Array<Object> => {
  const { table } = store

  // fetch sorting indexes of parents
  const projIndex = findIndex(tree.filteredAndSorted.projekt, {
    id: projId,
  })
  const apIndex = findIndex(
    tree.filteredAndSorted.ap.filter(a => a.proj_id === projId),
    { id: apId }
  )

  const popNodesLength = tree.filteredAndSorted.pop.filter(
    n => n.ap_id === apId
  ).length
  let message = popNodesLength
  if (table.popLoading) {
    message = '...'
  }
  if (tree.nodeLabelFilter.get('pop')) {
    message = `${popNodesLength} gefiltert`
  }

  return [
    {
      nodeType: 'folder',
      menuType: 'popFolder',
      id: apId,
      urlLabel: 'Populationen',
      label: `Populationen (${message})`,
      url: ['Projekte', projId, 'Aktionspläne', apId, 'Populationen'],
      sort: [projIndex, 1, apIndex, 1],
      hasChildren: popNodesLength > 0,
    },
  ]
}
