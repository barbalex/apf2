import findIndex from 'lodash/findIndex'

export default (store) => {
  const { activeUrlElements, tree } = store
  // fetch sorting indexes of parents
  const projId = activeUrlElements.projekt
  if (!projId) return []
  const projIndex = findIndex(store.tree.filteredAndSorted.projekt, { ProjId: projId })
  const apArtId = activeUrlElements.ap
  if (!apArtId) return []
  const apIndex = findIndex(store.tree.filteredAndSorted.ap, { ApArtId: apArtId })

  // map through all and create array of nodes
  return tree.filteredAndSorted.beobzuordnung.map((el, index) => {
    const beobId = isNaN(el.BeobId) ? el.BeobId : parseInt(el.BeobId, 10)

    return {
      nodeType: `table`,
      menuType: `beobzuordnung`,
      id: beobId,
      parentId: apArtId,
      label: el.label,
      expanded: beobId === activeUrlElements.beobzuordnung,
      url: [`Projekte`, projId, `Arten`, apArtId, `nicht-beurteilte-Beobachtungen`, beobId],
      sort: [projIndex, 1, apIndex, 8, index],
      hasChildren: false,
    }
  })
}
