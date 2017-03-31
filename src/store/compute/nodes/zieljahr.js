import findIndex from 'lodash/findIndex'

export default (store) => {
  const { activeUrlElements, tree } = store
  // fetch sorting indexes of parents
  const projId = activeUrlElements.projekt
  if (!projId) return []
  const projIndex = findIndex(tree.filteredAndSorted.projekt, { ProjId: projId })
  const apArtId = activeUrlElements.ap
  if (!apArtId) return []
  const apIndex = findIndex(tree.filteredAndSorted.ap, { ApArtId: apArtId })

  const nodes = tree.filteredAndSorted.zieljahr.map((z, index) => {
    // get nr of ziele for year
    // const nrOfZieleThisYear = ziele.filter(z => z.ZielJahr === jahr).length
    const childrenLength = tree.filteredAndSorted.ziel.length

    return {
      nodeType: `folder`,
      menuType: `zieljahr`,
      id: apArtId,
      parentId: apArtId,
      label: `${z.jahr == null ? `kein Jahr` : z.jahr} (${z.length})`,
      expanded: z.jahr && z.jahr === activeUrlElements.zieljahr,
      url: [`Projekte`, projId, `Arten`, apArtId, `AP-Ziele`, z.jahr],
      sort: [projIndex, 1, apIndex, 2, index],
      hasChildren: childrenLength > 0,
    }
  })
  return nodes
}
