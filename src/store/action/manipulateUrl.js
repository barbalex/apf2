// @flow
import isEqual from 'lodash/isEqual'
import queryString from 'query-string'
import { toJS } from 'mobx'

import getActiveNodeArrayFromPathname from './getActiveNodeArrayFromPathname'

export default (store: Object): void => {
  const activeNodeArrayFromUrl = getActiveNodeArrayFromPathname()
  const activeNodeArray = toJS(store.tree.activeNodeArray)
  const urlQueryFromUrl = queryString.parse(window.location.search)
  const urlQuery = toJS(store.urlQuery)

  if (
    !isEqual(activeNodeArrayFromUrl, activeNodeArray) ||
    !isEqual(urlQueryFromUrl, urlQuery)
  ) {
    const search = queryString.stringify(urlQuery)
    const query = `${Object.keys(urlQuery).length > 0 ? `?${search}` : ``}`
    store.history.push(`/${activeNodeArray.join(`/`)}${query}`)
  }
}
