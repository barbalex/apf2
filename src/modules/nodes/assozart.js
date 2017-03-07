import findIndex from 'lodash/findIndex'
import sortBy from 'lodash/sortBy'

export default (store) => {
  const { activeUrlElements, table } = store
  // fetch sorting indexes of parents
  const projId = activeUrlElements.projekt
  if (!projId) return []
  const projIndex = findIndex(store.table.filteredAndSorted.projekt, { ProjId: projId })
  const apArtId = activeUrlElements.ap
  if (!apArtId) return []
  const apIndex = findIndex(store.table.filteredAndSorted.ap, { ApArtId: apArtId })

  let nodes = table.filteredAndSorted.assozart.map((el, index) => {
    let label = `...`
    const { adb_eigenschaften } = store.table
    if (adb_eigenschaften.size > 0) {
      if (el.AaSisfNr) {
        label = adb_eigenschaften.get(el.AaSisfNr).Artname
      } else {
        label = `(keine Art gewählt)`
      }
    }
    const projId = store.table.ap.get(el.AaApArtId).ProjId
    const sort = [projIndex, 1, apIndex, 9, index]

    return {
      nodeType: `table`,
      menuType: `assozart`,
      id: el.AaId,
      parentId: apArtId,
      label,
      expanded: el.AaId === activeUrlElements.assozart,
      url: [`Projekte`, projId, `Arten`, apArtId, `assoziierte-Arten`, el.AaId],
    }
  })
  // filter by node.nodeLabelFilter
  const filterString = store.node.nodeLabelFilter.get(`assozart`)
  if (filterString) {
    nodes = nodes.filter(p =>
      p.label.toLowerCase().includes(filterString.toLowerCase())
    )
  }
  // sort by label and return
  return sortBy(nodes, `label`)
}
