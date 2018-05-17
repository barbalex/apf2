// @flow
import clone from 'lodash/clone'
import getActiveNodeArrayFromPathname from '../store/action/getActiveNodeArrayFromPathname'
import getUrlQuery from '../store/action/getUrlQuery'
import isMobilePhone from '../modules/isMobilePhone'

export default (store: Object) => {
  const activeNodeArrayFromPathname = getActiveNodeArrayFromPathname()
  let initialActiveNodeArray = clone(activeNodeArrayFromPathname)

  // forward apflora.ch to Projekte
  if (activeNodeArrayFromPathname.length === 0) {
    initialActiveNodeArray.push('Projekte')
  }

  store.tree.setActiveNodeArray(initialActiveNodeArray)
  // need to set openNodes
  store.tree.setOpenNodesFromActiveNodeArray()
  // clone tree2 in case tree2 is open
  store.tree.cloneActiveNodeArrayToTree2()
  const urlQuery = getUrlQuery(window.location.search)
  store.setUrlQuery(urlQuery)

  // set projekte tabs of not yet existing
  if (
    (activeNodeArrayFromPathname.length === 0 ||
      activeNodeArrayFromPathname[0] === 'Projekte') &&
    (!urlQuery.projekteTabs ||
      !urlQuery.projekteTabs.length ||
      urlQuery.projekteTabs.length === 0)
  ) {
    if (isMobilePhone()) {
      store.urlQuery.projekteTabs = ['tree']
    } else {
      store.urlQuery.projekteTabs = ['tree', 'daten']
    }
  }

  // signal to autorun that store is initiated
  // i.e. history shall be manipulated
  // on changes to urlQuery and activeNodes
  store.initiated = true

}
