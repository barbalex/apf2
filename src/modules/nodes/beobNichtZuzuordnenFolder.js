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
  const apIndex = findIndex(
    tree.filteredAndSorted.ap.filter(a => a.ProjId === projId),
    { ApArtId: apArtId }
  )

  // prevent folder from showing when nodeFilter is set
  if (apIndex === -1) return []

  const beobNichtZuzuordnenNodesLength = tree.filteredAndSorted.beobNichtZuzuordnen.filter(
    n => n.NO_ISFS === apArtId
  ).length

  let message = beobNichtZuzuordnenNodesLength
  if (store.loading.includes(`beobzuordnung`)) {
    message = `...`
  }
  if (tree.nodeLabelFilter.get(`beobNichtZuzuordnen`)) {
    message = `${beobNichtZuzuordnenNodesLength} gefiltert`
  }

  return [
    {
      nodeType: `folder`,
      menuType: `beobNichtZuzuordnenFolder`,
      id: apArtId,
      urlLabel: `nicht-zuzuordnende-Beobachtungen`,
      label: `Beobachtungen nicht zuzuordnen (${message})`,
      url: [
        `Projekte`,
        projId,
        `Arten`,
        apArtId,
        `nicht-zuzuordnende-Beobachtungen`
      ],
      sort: [projIndex, 1, apIndex, 9],
      hasChildren: beobNichtZuzuordnenNodesLength > 0
    }
  ]
}
