// @flow

import getActiveNodeArrayFromPathname from '../store/action/getActiveNodeArrayFromPathname'
import getUrlQuery from '../store/action/getUrlQuery'

export default (store: Object) => {
  const activeNodeArrayFromUrl = getActiveNodeArrayFromPathname()
  store.tree.setActiveNodeArray(activeNodeArrayFromUrl)
  store.tree.setLastClickedNode(activeNodeArrayFromUrl)
  // need to set openNodes
  store.tree.setOpenNodesFromActiveNodeArray()
  // clone tree2 in case tree2 is open
  store.tree.cloneActiveNodeArrayToTree2()
  const urlQuery = getUrlQuery(window.location.search)
  store.setUrlQuery(urlQuery)
  store.messages.fetch()
}
