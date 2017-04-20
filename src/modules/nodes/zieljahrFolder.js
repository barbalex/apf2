// @flow
import findIndex from 'lodash/findIndex'

export default (
  store: Object,
  tree: Object,
  projId: number,
  apArtId: number
): Array<Object> => {
  // fetch sorting indexes of parents
  const projIndex = findIndex(tree.filteredAndSorted.projekt, {
    ProjId: projId
  })
  const apIndex = findIndex(
    tree.filteredAndSorted.ap.filter(a => a.ProjId === projId),
    { ApArtId: apArtId }
  )

  // prevent folder from showing when nodeFilter is set
  if (apIndex === -1) return []

  const zieljahreNodesLength = tree.filteredAndSorted.zieljahr.length

  let message = `${zieljahreNodesLength} Jahre`
  if (store.table.zielLoading) {
    message = `...`
  }
  if (tree.nodeLabelFilter.get(`ziel`)) {
    const jahreTxt = zieljahreNodesLength === 1 ? `Jahr` : `Jahre`
    message = `${zieljahreNodesLength} ${jahreTxt} gefiltert`
  }

  return [
    {
      nodeType: `folder`,
      menuType: `zielFolder`,
      id: apArtId,
      urlLabel: `AP-Ziele`,
      label: `AP-Ziele (${message})`,
      url: [`Projekte`, projId, `Arten`, apArtId, `AP-Ziele`],
      sort: [projIndex, 1, apIndex, 2],
      hasChildren: zieljahreNodesLength > 0
    }
  ]
}
