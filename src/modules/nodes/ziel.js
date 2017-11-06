// @flow
import findIndex from 'lodash/findIndex'

export default (
  store: Object,
  tree: Object,
  projId: number,
  apArtId: number,
  zieljahr: number
): Array<Object> => {
  // fetch sorting indexes of parents
  const projIndex = findIndex(tree.filteredAndSorted.projekt, {
    ProjId: projId,
  })
  const apIndex = findIndex(
    tree.filteredAndSorted.ap.filter(a => a.ProjId === projId),
    { ApArtId: apArtId }
  )
  const zieljahrIndex = findIndex(tree.filteredAndSorted.zieljahr, {
    jahr: zieljahr,
  })

  // map through all and create array of nodes
  return tree.filteredAndSorted.ziel
    .filter(z => z.ApArtId === apArtId)
    .filter(z => z.ZielJahr === zieljahr)
    .map((el, index) => ({
      nodeType: 'table',
      menuType: 'ziel',
      id: el.ZielId,
      parentId: el.ApArtId,
      urlLabel: el.ZielId,
      label: el.label,
      url: [
        'Projekte',
        projId,
        'Arten',
        el.ApArtId,
        'AP-Ziele',
        el.ZielJahr,
        el.ZielId,
      ],
      sort: [projIndex, 1, apIndex, 2, zieljahrIndex, index],
      hasChildren: true,
    }))
}
