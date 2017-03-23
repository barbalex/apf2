import findIndex from 'lodash/findIndex'

export default (store) => {
  const { activeUrlElements, table } = store
  // fetch sorting indexes of parents
  const projId = activeUrlElements.projekt
  if (!projId) return []
  const projIndex = findIndex(store.table.filteredAndSorted.projekt, { ProjId: projId })

  // map through all ap and create array of nodes
  let nodes = table.filteredAndSorted.ap.map((el, index) => ({
    nodeType: `table`,
    menuType: `ap`,
    id: el.ApArtId,
    parentId: el.ProjId,
    label: el.label,
    expanded: el.ApArtId === activeUrlElements.ap,
    url: [`Projekte`, el.ProjId, `Arten`, el.ApArtId],
    level: 3,
    sort: [projIndex, 1, index],
    childrenLength: 6,
  }))
  return nodes
}
