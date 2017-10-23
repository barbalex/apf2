// @flow
import isEqual from 'lodash/isEqual'
import queryString from 'query-string'
import { toJS } from 'mobx'

import getActiveNodeArrayFromPathname from './getActiveNodeArrayFromPathname'

export default (store: Object): void => {
  const activeNodeArrayFromUrl = getActiveNodeArrayFromPathname()
  const { tree } = store
  const activeNodeArray = toJS(tree.activeNodeArray)
  const urlQueryFromUrl = queryString.parse(window.location.search)
  const urlQuery = toJS(store.urlQuery)
  const nodes = toJS(tree.nodes)

  // do not manipulate url if store is not yet initiated
  if (!store.initiated) return

  if (
    // when tree elements are clicked, activeNodeArray is changed
    !isEqual(activeNodeArrayFromUrl, activeNodeArray) ||
    // when tabs are clicked, urlQuery is changed
    !isEqual(urlQueryFromUrl, urlQuery)
  ) {
    // if above happened, need to change history
    const search = queryString.stringify(urlQuery)
    const query = `${Object.keys(urlQuery).length > 0 ? `?${search}` : ''}`
    store.history.push(`/${activeNodeArray.join('/')}${query}`)
  }

  // if activeNodeArray.length === 1
  // and there is only one projekte
  // open it
  const projekteFolderIsActive =
    activeNodeArray.length === 1 && activeNodeArray[0] === 'Projekte'
  const projekteNodes = nodes.filter(n => n.menuType === 'projekt')
  const existsOnlyOneProjekt = projekteNodes.length === 1
  if (projekteFolderIsActive && existsOnlyOneProjekt) {
    const projektNode = projekteNodes[0]
    if (projektNode) {
      tree.toggleNode(tree, projektNode)
    }
  }
}
