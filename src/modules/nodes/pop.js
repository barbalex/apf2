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
  return table.filteredAndSorted.pop.map((el, index) => {
    const sort = [projIndex, 1, apIndex, 1, index]

    return {
      nodeType: `table`,
      menuType: `pop`,
      id: el.PopId,
      parentId: el.ApArtId,
      label: el.label,
      expanded: el.PopId === activeUrlElements.pop,
      url: [`Projekte`, projId, `Arten`, el.ApArtId, `Populationen`, el.PopId],
      level: 5,
      sort,
      childrenLength: 3,
      /*
      children: [
        tpopFolderNode(store, projId, el.ApArtId, el.PopId),
        popberFolderNode(store, projId, el.ApArtId, el.PopId),
        popmassnberFolderNode(store, projId, el.ApArtId, el.PopId),
      ],*/
    }
  })
}
