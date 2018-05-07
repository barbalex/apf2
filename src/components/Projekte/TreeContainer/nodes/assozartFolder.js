// @flow
import findIndex from 'lodash/findIndex'
import get from 'lodash/get'
import format from 'date-fns/format'

export default ({
  data,
  tree,
  projektNodes,
  projId,
  apId,
}: {
  data: Object,
  tree: Object,
  projektNodes: Array<Object>,
  projId: String,
  apId: String,
}): Array<Object> => {
  const assozarts = get(data, 'assozarts.nodes', [])

  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(
    tree.filteredAndSorted.ap.filter(a => a.proj_id === projId),
    { id: apId }
  )
  const nodeLabelFilterString = tree.nodeLabelFilter.get('assozart')

  const assozartNodesLength = assozarts
    .filter(el => el.apId === apId)
    // filter by nodeLabelFilter
    .filter(el => {
      if (nodeLabelFilterString) {
        return get(el, 'aeEigenschaftenByAeId.artname', '(keine Art gewählt)')
          .toLowerCase()
          .includes(nodeLabelFilterString.toLowerCase())
      }
      return true
    }).length
  let message = assozartNodesLength
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
      url: ['Projekte', projId, 'Aktionspläne', apId, 'assoziierte-Arten'],
      sort: [projIndex, 1, apIndex, 8],
      hasChildren: assozartNodesLength > 0,
    },
  ]
}
