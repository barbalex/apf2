import findIndex from 'lodash/findIndex'

export default (store, tree, projId) => {
  // check passed variables
  if (!store) return store.listError(new Error('no store passed'))
  if (!tree) return store.listError(new Error('no tree passed'))
  if (!projId) return store.listError(new Error('no projId passed'))

  // fetch sorting indexes of parents
  const projIndex = findIndex(tree.filteredAndSorted.projekt, {
    ProjId: projId
  })

  // build label
  const apberuebersichtLength = tree.filteredAndSorted.apberuebersicht.filter(
    n => n.ProjId === projId
  ).length
  let message = apberuebersichtLength
  if (store.table.apberuebersichtLoading) {
    message = `...`
  }
  if (tree.nodeLabelFilter.get(`apberuebersicht`)) {
    message = `${apberuebersichtLength} gefiltert`
  }

  return [
    {
      menuType: `apberuebersichtFolder`,
      id: projId,
      urlLabel: `AP-Berichte`,
      label: `AP-Berichte (${message})`,
      url: [`Projekte`, projId, `AP-Berichte`],
      sort: [projIndex, 2],
      hasChildren: apberuebersichtLength > 0
    }
  ]
}
