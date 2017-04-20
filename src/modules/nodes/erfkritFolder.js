// @flow
import findIndex from 'lodash/findIndex'

export default (
  store: Object,
  tree: Object,
  projId: number,
  apArtId: number
): Array<Object> => {
  // check passed variables
  if (!store) return store.listError(new Error('no store passed'))
  if (!tree) return store.listError(new Error('no tree passed'))
  if (!apArtId) return store.listError(new Error('no apArtId passed'))
  if (!projId) return store.listError(new Error('no projId passed'))

  // fetch sorting indexes of parents
  const projIndex = findIndex(tree.filteredAndSorted.projekt, {
    ProjId: projId
  })
  const apIndex = findIndex(tree.filteredAndSorted.ap, { ApArtId: apArtId })

  // prevent folder from showing when nodeFilter is set
  if (apIndex === -1) return []

  const erfkritNodesLength = tree.filteredAndSorted.erfkrit.filter(
    n => n.ApArtId === apArtId
  ).length

  let message = erfkritNodesLength
  if (store.table.erfkritLoading) {
    message = `...`
  }
  if (tree.nodeLabelFilter.get(`erfkrit`)) {
    message = `${erfkritNodesLength} gefiltert`
  }

  return [
    {
      nodeType: `folder`,
      menuType: `erfkritFolder`,
      id: apArtId,
      urlLabel: `AP-Erfolgskriterien`,
      label: `AP-Erfolgskriterien (${message})`,
      url: [`Projekte`, projId, `Arten`, apArtId, `AP-Erfolgskriterien`],
      sort: [projIndex, 1, apIndex, 3],
      hasChildren: erfkritNodesLength > 0
    }
  ]
}
