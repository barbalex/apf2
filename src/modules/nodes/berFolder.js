// @flow
import findIndex from 'lodash/findIndex'

export default (
  store: Object,
  tree: Object,
  projId: number,
  apArtId: number
): Array<Object> => {
  const { table } = store

  // fetch sorting indexes of parents
  const projIndex = findIndex(tree.filteredAndSorted.projekt, {
    ProjId: projId
  })
  const apIndex = findIndex(
    tree.filteredAndSorted.ap.filter(a => a.ProjId === projId),
    { ApArtId: apArtId }
  )

  const berNodesLength = tree.filteredAndSorted.ber.filter(
    n => n.ApArtId === apArtId
  ).length

  let message = berNodesLength
  if (table.berLoading) {
    message = `...`
  }
  if (tree.nodeLabelFilter.get(`ber`)) {
    message = `${berNodesLength} gefiltert`
  }

  return [
    {
      nodeType: `folder`,
      menuType: `berFolder`,
      id: apArtId,
      urlLabel: `Berichte`,
      label: `Berichte (${message})`,
      url: [`Projekte`, projId, `Arten`, apArtId, `Berichte`],
      sort: [projIndex, 1, apIndex, 5],
      hasChildren: berNodesLength > 0
    }
  ]
}
