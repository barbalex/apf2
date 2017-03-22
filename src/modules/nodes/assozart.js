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

  let nodes = table.filteredAndSorted.assozart.map((el, index) => {
    const projId = store.table.ap.get(el.AaApArtId).ProjId
    const sort = [projIndex, 1, apIndex, 7, index]

    return {
      nodeType: `table`,
      menuType: `assozart`,
      id: el.AaId,
      parentId: apArtId,
      label: el.label,
      expanded: el.AaId === activeUrlElements.assozart,
      url: [`Projekte`, projId, `Arten`, apArtId, `assoziierte-Arten`, el.AaId],
      level: 5,
      sort,
      childrenLength: 0,
    }
  })
  return nodes
}
