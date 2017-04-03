import findIndex from 'lodash/findIndex'

export default (store, tree) => {
  // fetch sorting indexes of parents
  const projId = tree.activeNodes.projekt
  if (!projId) return []
  const projIndex = findIndex(tree.filteredAndSorted.projekt, { ProjId: projId })
  const apArtId = tree.activeNodes.ap
  if (!apArtId) return []
  const apIndex = findIndex(tree.filteredAndSorted.ap, { ApArtId: apArtId })

  // map through all and create array of nodes
  return tree.filteredAndSorted.beobNichtZuzuordnen.map((el, index) => {
    const beobId = isNaN(el.NO_NOTE) ? el.NO_NOTE : parseInt(el.NO_NOTE, 10)

    return {
      nodeType: `table`,
      menuType: `beobNichtZuzuordnen`,
      id: beobId,
      parentId: apArtId,
      label: el.label,
      expanded: beobId === tree.activeNodes.beobNichtZuzuordnen,
      url: [`Projekte`, projId, `Arten`, apArtId, `nicht-zuzuordnende-Beobachtungen`, beobId],
      sort: [projIndex, 1, apIndex, 9, index],
      hasChildren: false,
    }
  })
}
