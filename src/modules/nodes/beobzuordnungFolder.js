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

  const beobzuordnungNodesLength = tree.filteredAndSorted.beobzuordnung.filter(
    n => n.NO_ISFS === apArtId
  ).length

  let message = beobzuordnungNodesLength
  if (store.loading.includes(`beob_bereitgestellt`)) {
    message = `...`
  }
  if (tree.nodeLabelFilter.get(`beobzuordnung`)) {
    message = `${beobzuordnungNodesLength} gefiltert`
  }

  return [
    {
      nodeType: `folder`,
      menuType: `beobzuordnungFolder`,
      id: apArtId,
      urlLabel: `nicht-beurteilte-Beobachtungen`,
      label: `Beobachtungen nicht beurteilt (${message})`,
      url: [
        `Projekte`,
        projId,
        `Arten`,
        apArtId,
        `nicht-beurteilte-Beobachtungen`
      ],
      sort: [projIndex, 1, apIndex, 8],
      hasChildren: beobzuordnungNodesLength > 0
    }
  ]
}
