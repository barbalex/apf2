// @flow

export default (store:Object) => {
  const { activeNodeArray } = store.tree

  // if new store set projekte tabs
  if (
    (activeNodeArray.length === 0 || activeNodeArray[0] === `Projekte`) &&
    store.urlQuery.projekteTabs.length === 0
  ) {
    store.urlQuery.projekteTabs = [`tree`, `daten`]
  }
}
