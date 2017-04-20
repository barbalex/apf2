// @flow
import findIndex from 'lodash/findIndex'

export default (
  store: Object,
  tree: Object,
  projId: number,
  apArtId: number,
  zieljahr: number
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
  const zieljahrIndex = findIndex(tree.filteredAndSorted.zieljahr, {
    jahr: zieljahr
  })

  // map through all and create array of nodes
  return tree.filteredAndSorted.ziel
    .filter(z => z.ZielJahr === zieljahr)
    .map((el, index) => ({
      nodeType: `table`,
      menuType: `ziel`,
      id: el.ZielId,
      parentId: el.ApArtId,
      urlLabel: el.ZielId,
      label: el.label,
      url: [
        `Projekte`,
        projId,
        `Arten`,
        el.ApArtId,
        `AP-Ziele`,
        el.ZielJahr,
        el.ZielId
      ],
      sort: [projIndex, 1, apIndex, 2, zieljahrIndex, index],
      hasChildren: true
    }))
}
