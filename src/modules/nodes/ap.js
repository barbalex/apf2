// @flow
import findIndex from 'lodash/findIndex'

export default (store: Object, tree: Object, projId: number): Array<Object> => {
  // fetch sorting indexes of parents
  const projIndex = findIndex(tree.filteredAndSorted.projekt, {
    ProjId: projId
  })

  // map through all pop and create array of nodes
  return tree.filteredAndSorted.ap
    .filter(n => n.ProjId === projId)
    .map((el, index) => ({
      nodeType: `table`,
      menuType: `ap`,
      id: el.ApArtId,
      parentId: el.ProjId,
      urlLabel: el.ApArtId,
      label: el.label,
      url: [`Projekte`, el.ProjId, `Arten`, el.ApArtId],
      sort: [projIndex, 1, index],
      hasChildren: true
    }))
}
