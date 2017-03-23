import findIndex from 'lodash/findIndex'

export default (store) => {
  const { activeUrlElements, table } = store
  // fetch sorting indexes of parents
  const projId = activeUrlElements.projekt
  if (!projId) return []
  const projIndex = findIndex(table.filteredAndSorted.projekt, { ProjId: projId })
  const apArtId = activeUrlElements.ap
  if (!apArtId) return []
  const apIndex = findIndex(table.filteredAndSorted.ap, { ApArtId: apArtId })

  const nodes = table.filteredAndSorted.zieljahr.map((z, index) => {
    // get nr of ziele for year
    // const nrOfZieleThisYear = ziele.filter(z => z.ZielJahr === jahr).length
    const childrenLength = table.filteredAndSorted.ziel.length

    return {
      nodeType: `folder`,
      menuType: `zieljahr`,
      id: apArtId,
      parentId: apArtId,
      label: `${z.jahr == null ? `kein Jahr` : z.jahr} (${z.length})`,
      expanded: z.jahr && z.jahr === activeUrlElements.zieljahr,
      url: [`Projekte`, projId, `Arten`, apArtId, `AP-Ziele`, z.jahr],
      level: 5,
      sort: [projIndex, 1, apIndex, 2, index],
      childrenLength,
    }
  })
  return nodes
}
