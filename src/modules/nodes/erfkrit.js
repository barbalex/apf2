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

  // map through all erfkrit and create array of nodes
  return tree.filteredAndSorted.erfkrit
    .filter(p => p.ap_id === apId)
    .map((el, index) => ({
      nodeType: 'table',
      menuType: 'erfkrit',
      id: el.id,
      parentId: el.ap_id,
      urlLabel: el.id,
      label: el.label,
      url: [
        'Projekte',
        projId,
        'Arten',
        el.ap_id,
        'AP-Erfolgskriterien',
        el.id,
      ],
      sort: [projIndex, 1, apIndex, 3, index],
      hasChildren: false,
    }))
}
