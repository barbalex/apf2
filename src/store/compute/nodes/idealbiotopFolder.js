import findIndex from 'lodash/findIndex'

export default (store, tree) => {
  const { activeNodes } = tree

  // fetch sorting indexes of parents
  const projId = activeNodes.projekt
  if (!projId) return []
  const projIndex = findIndex(tree.filteredAndSorted.projekt, { ProjId: projId })
  const apArtId = activeNodes.ap
  if (!apArtId) return []
  const apIndex = findIndex(tree.filteredAndSorted.ap, { ApArtId: apArtId })
  // prevent folder from showing when nodeFilter is set
  if (apIndex === -1) return []

  return {
    nodeType: `folder`,
    menuType: `idealbiotopFolder`,
    id: apArtId,
    label: `Idealbiotop`,
    expanded: activeNodes.idealbiotopFolder,
    url: [`Projekte`, projId, `Arten`, apArtId, `Idealbiotop`],
    sort: [projIndex, 1, apIndex, 6],
    hasChildren: false,
  }
}
