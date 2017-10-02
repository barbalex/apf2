// @flow
import isMobilePhone from '../../modules/isMobilePhone'
export default (store: Object): void => {
  const { activeNodeArray } = store.tree

  // if new store set projekte tabs
  if (
    (activeNodeArray.length === 0 || activeNodeArray[0] === 'Projekte') &&
    store.urlQuery.projekteTabs.length === 0
  ) {
    if (isMobilePhone()) {
      store.urlQuery.projekteTabs = ['tree']
    } else {
      store.urlQuery.projekteTabs = ['tree', 'daten']
    }
  }
}
