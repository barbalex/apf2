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
    ProjId: projId,
  })
  const apIndex = findIndex(
    tree.filteredAndSorted.ap.filter(a => a.ProjId === projId),
    { ApArtId: apArtId }
  )

  return tree.filteredAndSorted.beobart
    .filter(p => p.ApArtId === apArtId)
    .map((el, index) => ({
      nodeType: 'table',
      menuType: 'beobart',
      id: el.BeobArtId,
      parentId: apArtId,
      urlLabel: el.BeobArtId,
      label: el.label,
      url: [
        'Projekte',
        projId,
        'Arten',
        apArtId,
        'arten-fuer-beobachtungen',
        el.BeobArtId,
      ],
      sort: [projIndex, 1, apIndex, 8, index],
      hasChildren: false,
    }))
}
