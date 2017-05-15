// @flow
export default (store: Object, tree: Object, x: number, y: number): any => {
  let { idOfTpopBeingLocalized } = store.map.tpop
  const tpops = Array.from(store.table.tpop.values())
  const tpop = tpops.find(t => t.TPopId === idOfTpopBeingLocalized)
  if (!tpop)
    return store.listError(
      new Error(`no tpop found with id "${idOfTpopBeingLocalized}"`),
    )
  const xRounded = Number(x).toFixed(0)
  const yRounded = Number(y).toFixed(0)
  store.updateProperty(tree, 'TPopXKoord', xRounded)
  store.updatePropertyInDb(tree, 'TPopXKoord', xRounded)
  store.updateProperty(tree, 'TPopYKoord', yRounded)
  store.updatePropertyInDb(tree, 'TPopYKoord', yRounded)
  // reset localizing
  store.map.tpop.idOfTpopBeingLocalized = 0
}
