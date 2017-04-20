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

  return [
    {
      nodeType: `folder`,
      menuType: `idealbiotopFolder`,
      id: apArtId,
      urlLabel: `Idealbiotop`,
      label: `Idealbiotop`,
      url: [`Projekte`, projId, `Arten`, apArtId, `Idealbiotop`],
      sort: [projIndex, 1, apIndex, 6],
      hasChildren: false
    }
  ]
}
