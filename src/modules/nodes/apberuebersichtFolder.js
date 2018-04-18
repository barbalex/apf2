// @flow
import findIndex from 'lodash/findIndex'

export default (store: Object, tree: Object, projId: number): Array<Object> => {
  // fetch sorting indexes of parents
  const projIndex = findIndex(tree.filteredAndSorted.projekt, {
    id: projId,
  })

  // build label
  const apberuebersichtLength = tree.filteredAndSorted.apberuebersicht.filter(
    n => n.proj_id === projId
  ).length
  let message = apberuebersichtLength
  if (store.table.apberuebersichtLoading) {
    message = '...'
  }
  if (tree.nodeLabelFilter.get('apberuebersicht')) {
    message = `${apberuebersichtLength} gefiltert`
  }

  return [
    {
      menuType: 'apberuebersichtFolder',
      id: projId,
      urlLabel: 'AP-Berichte',
      label: `AP-Berichte (${message})`,
      url: ['Projekte', projId, 'AP-Berichte'],
      sort: [projIndex, 2],
      hasChildren: apberuebersichtLength > 0,
    },
  ]
}
