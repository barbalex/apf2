// @flow
import findIndex from 'lodash/findIndex'

export default (
  store: Object,
  tree: Object,
  projId: number,
  apId: number,
  zieljahr: number
): Array<Object> => {
  // fetch sorting indexes of parents
  const projIndex = findIndex(tree.filteredAndSorted.projekt, {
    ProjId: projId,
  })
  const apIndex = findIndex(
    tree.filteredAndSorted.ap.filter(a => a.ProjId === projId),
    { ApArtId: apId }
  )
  const zieljahrIndex = findIndex(tree.filteredAndSorted.zieljahr, {
    jahr: zieljahr,
  })

  // map through all and create array of nodes
  return tree.filteredAndSorted.ziel
    .filter(z => z.ap_id === apId)
    .filter(z => z.jahr === zieljahr)
    .map((el, index) => ({
      nodeType: 'table',
      menuType: 'ziel',
      id: el.id,
      parentId: el.ap_id,
      urlLabel: el.id,
      label: el.label,
      url: ['Projekte', projId, 'Arten', el.ap_id, 'AP-Ziele', el.jahr, el.id],
      sort: [projIndex, 1, apIndex, 2, zieljahrIndex, index],
      hasChildren: true,
    }))
}
