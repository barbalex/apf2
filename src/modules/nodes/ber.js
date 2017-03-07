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
  return table.filteredAndSorted.ber.map((el, index) => {
    const sort = [projIndex, 1, apIndex, 5, index]

    return {
      nodeType: `table`,
      menuType: `ber`,
      id: el.BerId,
      parentId: el.ApArtId,
      label: el.label,
      expanded: el.BerId === activeUrlElements.ber,
      url: [`Projekte`, projId, `Arten`, el.ApArtId, `Berichte`, el.BerId],
      level: 5,
      sort,
      childrenLength: 0,
    }
  })
}
