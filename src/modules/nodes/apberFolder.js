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
    ProjId: projId,
  })
  const apIndex = findIndex(
    tree.filteredAndSorted.ap.filter(a => a.ProjId === projId),
    { ApArtId: apId }
  )

  const apberNodesLength = tree.filteredAndSorted.apber.filter(
    n => n.ap_id === apId
  ).length

  let message = apberNodesLength
  if (table.apberLoading) {
    message = '...'
  }
  if (tree.nodeLabelFilter.get('apber')) {
    message = `${apberNodesLength} gefiltert`
  }

  return [
    {
      nodeType: 'folder',
      menuType: 'apberFolder',
      id: apId,
      urlLabel: 'AP-Berichte',
      label: `AP-Berichte (${message})`,
      url: ['Projekte', projId, 'Arten', apId, 'AP-Berichte'],
      sort: [projIndex, 1, apIndex, 4],
      hasChildren: apberNodesLength > 0,
    },
  ]
}
