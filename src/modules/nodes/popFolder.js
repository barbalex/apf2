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

  const { table } = store

  // fetch sorting indexes of parents
  const projIndex = findIndex(tree.filteredAndSorted.projekt, {
    ProjId: projId
  })
  const apIndex = findIndex(tree.filteredAndSorted.ap, { ApArtId: apArtId })

  // prevent folder from showing when nodeFilter is set
  if (apIndex === -1) return []

  const popNodesLength = tree.filteredAndSorted.pop.filter(
    n => n.ApArtId === apArtId
  ).length
  let message = popNodesLength
  if (table.popLoading) {
    message = `...`
  }
  if (tree.nodeLabelFilter.get(`pop`)) {
    message = `${popNodesLength} gefiltert`
  }

  return [
    {
      nodeType: `folder`,
      menuType: `popFolder`,
      id: apArtId,
      urlLabel: `Populationen`,
      label: `Populationen (${message})`,
      url: [`Projekte`, projId, `Arten`, apArtId, `Populationen`],
      sort: [projIndex, 1, apIndex, 1],
      hasChildren: popNodesLength > 0
    }
  ]
}
