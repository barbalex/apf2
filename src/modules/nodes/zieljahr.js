// @flow
import findIndex from 'lodash/findIndex'

export default (
  store: Object,
  tree: Object,
  projId: number,
  apId: number
): Array<Object> => {
  // fetch sorting indexes of parents
  const projIndex = findIndex(tree.filteredAndSorted.projekt, {
    ProjId: projId,
  })
  const apIndex = findIndex(
    tree.filteredAndSorted.ap.filter(a => a.ProjId === projId),
    { ApArtId: apId }
  )

  const nodes = tree.filteredAndSorted.zieljahr.map((z, index) => {
    // get nr of ziele for year
    // const nrOfZieleThisYear = ziele.filter(z => z.jahr === jahr).length
    const childrenLength = tree.filteredAndSorted.ziel.length

    return {
      nodeType: 'folder',
      menuType: 'zieljahr',
      id: apId,
      parentId: apId,
      urlLabel: z.jahr == null ? 'kein-Jahr' : z.jahr,
      label: `${z.jahr == null ? 'kein Jahr' : z.jahr} (${z.length})`,
      url: ['Projekte', projId, 'Arten', apId, 'AP-Ziele', z.jahr],
      sort: [projIndex, 1, apIndex, 2, index],
      hasChildren: childrenLength > 0,
    }
  })
  return nodes
}
