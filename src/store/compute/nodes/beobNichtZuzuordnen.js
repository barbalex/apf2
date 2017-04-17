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
  return filteredAndSorted.beobNichtZuzuordnen.map((el, index) => {
    const beobId = isNaN(el.NO_NOTE) ? el.NO_NOTE : parseInt(el.NO_NOTE, 10)

    return {
      nodeType: `table`,
      menuType: `beobNichtZuzuordnen`,
      id: beobId,
      parentId: apArtId,
      urlLabel: beobId,
      label: el.label,
      url: [
        `Projekte`,
        projId,
        `Arten`,
        apArtId,
        `nicht-zuzuordnende-Beobachtungen`,
        beobId
      ],
      sort: [projIndex, 1, apIndex, 9, index],
      hasChildren: false
    }
  })
}
