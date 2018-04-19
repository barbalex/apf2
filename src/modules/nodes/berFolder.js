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

  const berNodesLength = tree.filteredAndSorted.ber.filter(
    n => n.ap_id === apId
  ).length

  let message = berNodesLength
  if (table.berLoading) {
    message = '...'
  }
  if (tree.nodeLabelFilter.get('ber')) {
    message = `${berNodesLength} gefiltert`
  }

  return [
    {
      nodeType: 'folder',
      menuType: 'berFolder',
      id: apId,
      urlLabel: 'Berichte',
      label: `Berichte (${message})`,
      url: ['Projekte', projId, 'Aktionspläne', apId, 'Berichte'],
      sort: [projIndex, 1, apIndex, 5],
      hasChildren: berNodesLength > 0,
    },
  ]
}
