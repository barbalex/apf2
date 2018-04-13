// @flow
export default (store: Object, tree: Object, x: number, y: number): any => {
  let { idOfTpopBeingLocalized } = store.map.tpop
  const tpops = Array.from(store.table.tpop.values())
  const tpop = tpops.find(t => t.id === idOfTpopBeingLocalized)
  if (!tpop)
    return store.listError(
      new Error(`no tpop found with id "${idOfTpopBeingLocalized}"`)
    )
  const xRounded = Number(x).toFixed(0)
  const yRounded = Number(y).toFixed(0)
  store.updateProperty(tree, 'x', xRounded)
  store.updatePropertyInDb(tree, 'x', xRounded)
  store.updateProperty(tree, 'y', yRounded)
  store.updatePropertyInDb(tree, 'y', yRounded)
  // reset localizing
  store.map.tpop.idOfTpopBeingLocalized = 0
}
