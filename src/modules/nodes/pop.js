import findIndex from 'lodash/findIndex'

export default (store) => {
  const { activeUrlElements, table } = store
  // fetch sorting indexes of parents
  const projId = activeUrlElements.projekt
  if (!projId) return []
  const projIndex = findIndex(store.table.filteredAndSorted.projekt, { ProjId: projId })
  const apArtId = activeUrlElements.ap
  if (!apArtId) return []
  const apIndex = findIndex(store.table.filteredAndSorted.ap, { ApArtId: apArtId })

  // map through all pop and create array of nodes
  return table.filteredAndSorted.pop.map((el, index) => ({
    nodeType: `table`,
    menuType: `pop`,
    id: el.PopId,
    parentId: el.ApArtId,
    label: el.label,
    expanded: el.PopId === activeUrlElements.pop,
    url: [`Projekte`, projId, `Arten`, el.ApArtId, `Populationen`, el.PopId],
    level: 5,
    sort: [projIndex, 1, apIndex, 1, index],
    childrenLength: 3,
  }))
}
