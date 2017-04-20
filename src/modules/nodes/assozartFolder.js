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

  const assozartNodesLength = tree.filteredAndSorted.assozart.filter(
    n => n.AaApArtId === apArtId
  ).length
  let message = assozartNodesLength
  if (store.table.assozartLoading) {
    message = `...`
  }
  if (tree.nodeLabelFilter.get(`assozart`)) {
    message = `${assozartNodesLength} gefiltert`
  }

  return [
    {
      nodeType: `folder`,
      menuType: `assozartFolder`,
      id: apArtId,
      urlLabel: `assoziierte-Arten`,
      label: `assoziierte Arten (${message})`,
      url: [`Projekte`, projId, `Arten`, apArtId, `assoziierte-Arten`],
      sort: [projIndex, 1, apIndex, 7],
      hasChildren: assozartNodesLength > 0
    }
  ]
}
