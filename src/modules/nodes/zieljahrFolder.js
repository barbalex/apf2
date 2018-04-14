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

  const zieljahreNodesLength = tree.filteredAndSorted.zieljahr.length

  let message = `${zieljahreNodesLength} Jahre`
  if (store.table.zielLoading) {
    message = '...'
  }
  if (tree.nodeLabelFilter.get('ziel')) {
    const jahreTxt = zieljahreNodesLength === 1 ? 'Jahr' : 'Jahre'
    message = `${zieljahreNodesLength} ${jahreTxt} gefiltert`
  }

  return [
    {
      nodeType: 'folder',
      menuType: 'zieljahrFolder',
      id: apId,
      urlLabel: 'AP-Ziele',
      label: `AP-Ziele (${message})`,
      url: ['Projekte', projId, 'Arten', apId, 'AP-Ziele'],
      sort: [projIndex, 1, apIndex, 2],
      hasChildren: zieljahreNodesLength > 0,
    },
  ]
}
