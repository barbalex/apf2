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

  // map through all projekt and create array of nodes
  let nodes = table.filteredAndSorted.erfkrit.map((el, index) => {
    const sort = [projIndex, 1, apIndex, 3, index]

    return {
      nodeType: `table`,
      menuType: `erfkrit`,
      id: el.ErfkritId,
      parentId: el.ApArtId,
      label: el.label,
      expanded: el.ErfkritId === activeUrlElements.erfkrit,
      url: [`Projekte`, projId, `Arten`, el.ApArtId, `AP-Erfolgskriterien`, el.ErfkritId],
      level: 5,
      sort,
      childrenLength: 0,
    }
  })
  return nodes
}
