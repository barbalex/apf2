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

  // map through all projekt and create array of nodes
  return table.filteredAndSorted.apber.map((el, index) => {
    const projId = store.table.ap.get(el.ApArtId).ProjId
    const sort = [projIndex, 1, apIndex, 4, index]

    return {
      nodeType: `table`,
      menuType: `apber`,
      id: el.JBerId,
      parentId: el.ApArtId,
      label: el.label,
      expanded: el.JBerJahr === activeUrlElements.apber,
      url: [`Projekte`, projId, `Arten`, el.ApArtId, `AP-Berichte`, el.JBerId],
      level: 5,
      sort,
      childrenLength: 0,
    }
  })
}
