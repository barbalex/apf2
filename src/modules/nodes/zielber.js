import findIndex from 'lodash/findIndex'

export default (store, tree, projId, apArtId, zieljahr, zielId) => {
  // check passed variables
  if (!store) return store.listError(new Error('no store passed'))
  if (!tree) return store.listError(new Error('no tree passed'))
  if (!apArtId) return store.listError(new Error('no apArtId passed'))
  if (!projId) return store.listError(new Error('no projId passed'))
  if (!zieljahr) return store.listError(new Error('no zieljahr passed'))
  if (!zielId) return store.listError(new Error('no zielId passed'))

  // fetch sorting indexes of parents
  const projIndex = findIndex(tree.filteredAndSorted.projekt, {
    ProjId: projId
  })
  const apIndex = findIndex(tree.filteredAndSorted.ap, { ApArtId: apArtId })
  const zieljahrIndex = findIndex(tree.filteredAndSorted.zieljahr, {
    jahr: zieljahr
  })
  const zielIndex = findIndex(tree.filteredAndSorted.ziel, { ZielId: zielId })

  // map through all and create array of nodes
  return tree.filteredAndSorted.zielber
    .filter(z => z.ZielId === zielId)
    .map((el, index) => ({
      nodeType: `table`,
      menuType: `zielber`,
      id: el.ZielBerId,
      parentId: el.ZielId,
      urlLabel: el.ZielBerId,
      label: el.label,
      url: [
        `Projekte`,
        projId,
        `Arten`,
        apArtId,
        `AP-Ziele`,
        zieljahr,
        el.ZielId,
        `Berichte`,
        el.ZielBerId
      ],
      sort: [projIndex, 1, apIndex, 2, zieljahrIndex, zielIndex, 1, index],
      hasChildren: false
    }))
}
