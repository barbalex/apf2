import findIndex from 'lodash/findIndex'

export default (store) => {
  const { activeUrlElements } = store
  // fetch sorting indexes of parents
  const projId = activeUrlElements.projekt
  if (!projId) return []
  const projIndex = findIndex(store.table.filteredAndSorted.projekt, { ProjId: projId })

  return {
    menuType: `exporte`,
    id: projId,
    label: `Exporte`,
    expanded: activeUrlElements.exporte,
    url: [`Projekte`, projId, `Exporte`],
    level: 2,
    sort: [projIndex, 3],
    childrenLength: 0,
  }
}
