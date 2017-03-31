import findIndex from 'lodash/findIndex'

export default (store) => {
  const { activeUrlElements, tree, table } = store

  // fetch sorting indexes of parents
  const projId = activeUrlElements.projekt
  if (!projId) return []
  const projIndex = findIndex(tree.filteredAndSorted.projekt, { ProjId: projId })
  const apArtId = activeUrlElements.ap
  if (!apArtId) return []
  const apIndex = findIndex(tree.filteredAndSorted.ap, { ApArtId: apArtId })
  const popId = activeUrlElements.pop
  if (!popId) return []
  const popIndex = findIndex(tree.filteredAndSorted.pop, { PopId: popId })
  const tpopId = activeUrlElements.tpop
  if (!tpopId) return []
  const tpopIndex = findIndex(tree.filteredAndSorted.tpop, { TPopId: tpopId })
  const tpopfeldkontrId = activeUrlElements.tpopfeldkontr
  if (!tpopfeldkontrId) return []
  const tpopfeldkontrIndex = findIndex(tree.filteredAndSorted.tpopfeldkontr, { TPopKontrId: tpopfeldkontrId })

  const childrenLength = tree.filteredAndSorted.tpopfeldkontrzaehl.length

  let message = childrenLength
  if (table.tpopkontrLoading) {
    message = `...`
  }
  if (tree.nodeLabelFilter.get(`tpopfeldkontr`)) {
    message = `${childrenLength} gefiltert`
  }

  return {
    nodeType: `folder`,
    menuType: `tpopfeldkontrzaehlFolder`,
    id: tpopfeldkontrId,
    label: `Zählungen (${message})`,
    expanded: activeUrlElements.tpopfeldkontrzaehlFolder,
    url: [`Projekte`, projId, `Arten`, apArtId, `Populationen`, popId, `Teil-Populationen`, tpopId, `Feld-Kontrollen`, tpopfeldkontrId, `Zaehlungen`],
    sort: [projIndex, 1, apIndex, 1, popIndex, 1, tpopIndex, 3, tpopfeldkontrIndex, 1],
    hasChildren: childrenLength > 0,
  }
}
