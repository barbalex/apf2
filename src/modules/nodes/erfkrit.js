import findIndex from 'lodash/findIndex'

export default (store) => {
  const { activeUrlElements, node } = store
  // fetch sorting indexes of parents
  const projId = activeUrlElements.projekt
  if (!projId) return []
  const projIndex = findIndex(node.filteredAndSorted.projekt, { ProjId: projId })
  const apArtId = activeUrlElements.ap
  if (!apArtId) return []
  const apIndex = findIndex(node.filteredAndSorted.ap, { ApArtId: apArtId })

  // map through all erfkrit and create array of nodes
  return node.filteredAndSorted.erfkrit.map((el, index) => ({
    nodeType: `table`,
    menuType: `erfkrit`,
    id: el.ErfkritId,
    parentId: el.ApArtId,
    label: el.label,
    expanded: el.ErfkritId === activeUrlElements.erfkrit,
    url: [`Projekte`, projId, `Arten`, el.ApArtId, `AP-Erfolgskriterien`, el.ErfkritId],
    level: 5,
    sort: [projIndex, 1, apIndex, 3, index],
    childrenLength: 0,
  }))
}
