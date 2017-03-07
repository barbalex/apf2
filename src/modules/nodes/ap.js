import findIndex from 'lodash/findIndex'

export default (store) => {
  const { activeUrlElements, table } = store
  // fetch sorting indexes of parents
  const projId = activeUrlElements.projekt
  if (!projId) return []
  const projIndex = findIndex(store.table.filteredAndSorted.projekt, { ProjId: projId })

  // map through all ap and create array of nodes
  let nodes = table.filteredAndSorted.ap.map((el, index) => {
    const sort = [projIndex, 1, index]
    return {
      nodeType: `table`,
      menuType: `ap`,
      id: el.ApArtId,
      parentId: el.ProjId,
      label: el.label,
      expanded: el.ApArtId === activeUrlElements.ap,
      url: [`Projekte`, el.ProjId, `Arten`, el.ApArtId],
      level: 3,
      sort,
      childrenLength: 0,
      children: [
        // popFolderNode(store, el.ProjId, el.ApArtId),
        // zieljahreFolderNode(store, el.ProjId, el.ApArtId),
        // erfkritFolderNode(store, el.ProjId, el.ApArtId),
        // apberFolderNode(store, el.ProjId, el.ApArtId),
        // berFolderNode(store, el.ProjId, el.ApArtId),
        // beobzuordnungFolderNode(store, el.ProjId, el.ApArtId),
        // beobNichtZuzuordnenFolderNode(store, el.ProjId, el.ApArtId),
        // idealbiotopFolderNode(store, el.ProjId, el.ApArtId),
        // assozartFolderNode(store, el.ProjId, el.ApArtId),
        // qkFolderNode(store, el.ProjId, el.ApArtId),
      ],
    }
  })
  return nodes
}
