// @flow
import clone from 'lodash/clone'
import queryString from 'query-string'

export default (store:Object, key:string, value:string) => {
  const urlQuery = clone(store.urlQuery)
  if (!value && value !== 0) {
    delete urlQuery[key]
  } else {
    urlQuery[key] = value
  }
  const search = queryString.stringify(urlQuery)
  const query = `${Object.keys(urlQuery).length > 0 ? `?${search}` : ``}`
  store.history.push(
    `/${store.tree.activeNodeArray.join(`/`)}${query}`
  )
}
