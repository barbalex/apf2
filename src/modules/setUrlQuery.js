import clone from 'lodash/clone'
import queryString from 'query-string'

export default (store, key, value) => {
  const urlQuery = clone(store.urlQuery)
  if (!value && value !== 0) {
    delete urlQuery[key]
  } else {
    urlQuery[key] = value
  }
  const search = queryString.stringify(urlQuery)
  store.history.push(
    `/${store.url.join(`/`)}${Object.keys(urlQuery).length > 0 ? `?${search}` : ``}`
  )
}
