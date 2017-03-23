import findIndex from 'lodash/findIndex'

export default (store) => {
  const { activeUrlElements } = store

  // fetch sorting indexes of parents
  const projId = activeUrlElements.projekt
  if (!projId) return []
  const projIndex = findIndex(store.table.filteredAndSorted.projekt, { ProjId: projId })
  const apArtId = activeUrlElements.ap
  if (!apArtId) return []
  const apIndex = findIndex(store.table.filteredAndSorted.ap, { ApArtId: apArtId })

  return {
    nodeType: `folder`,
    menuType: `idealbiotopFolder`,
    id: apArtId,
    label: `Idealbiotop`,
    expanded: activeUrlElements.idealbiotopFolder,
    url: [`Projekte`, projId, `Arten`, apArtId, `Idealbiotop`],
    level: 4,
    sort: [projIndex, 1, apIndex, 6],
    childrenLength: 0,
  }
}
