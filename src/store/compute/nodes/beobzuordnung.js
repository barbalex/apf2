import findIndex from 'lodash/findIndex'

export default (store, tree) => {
  const { activeNodes, filteredAndSorted } = tree
  // fetch sorting indexes of parents
  const projId = activeNodes.projekt
  if (!projId) return []
  const projIndex = findIndex(filteredAndSorted.projekt, { ProjId: projId })
  const apArtId = activeNodes.ap
  if (!apArtId) return []
  const apIndex = findIndex(filteredAndSorted.ap, { ApArtId: apArtId })

  // map through all and create array of nodes
  return filteredAndSorted.beobzuordnung.map((el, index) => {
    const beobId = isNaN(el.BeobId) ? el.BeobId : parseInt(el.BeobId, 10)

    return {
      nodeType: `table`,
      menuType: `beobzuordnung`,
      id: beobId,
      parentId: apArtId,
      urlLabel: beobId,
      label: el.label,
      expanded: beobId === activeNodes.beobzuordnung,
      url: [`Projekte`, projId, `Arten`, apArtId, `nicht-beurteilte-Beobachtungen`, beobId],
      sort: [projIndex, 1, apIndex, 8, index],
      hasChildren: false,
    }
  })
}
