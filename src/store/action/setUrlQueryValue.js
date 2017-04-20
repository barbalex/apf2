// @flow
import clone from 'lodash/clone'

export default (store: Object, key: string, value: string): void => {
  const urlQuery = clone(store.urlQuery)
  if (!value && value !== 0) {
    delete urlQuery[key]
  } else {
    urlQuery[key] = value
  }
  store.setUrlQuery(urlQuery)
}
