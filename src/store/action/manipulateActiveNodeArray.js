// @flow

export default (store:Object) => {
  // forward apflora.ch to Projekte
  if (store.tree.activeNodeArray.length === 0) {
    store.tree.activeNodeArray.push(`Projekte`)
  }
}
