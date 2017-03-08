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
  const popId = activeUrlElements.pop
  if (!popId) return []
  const popIndex = findIndex(table.filteredAndSorted.pop, { PopId: popId })

  return table.filteredAndSorted.popmassnber.map((el, index) => {
    const sort = [projIndex, 1, apIndex, 1, popIndex, 3, index]

    return {
      nodeType: `table`,
      menuType: `popmassnber`,
      id: el.PopMassnBerId,
      parentId: popId,
      label: el.label,
      expanded: el.PopMassnBerId === activeUrlElements.popmassnber,
      url: [`Projekte`, projId, `Arten`, apArtId, `Populationen`, popId, `Massnahmen-Berichte`, el.PopMassnBerId],
      level: 7,
      sort,
      childrenLength: 0,
    }
  })
}
