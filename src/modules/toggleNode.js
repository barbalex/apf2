// @flow
import queryString from 'query-string'

export default (store:Object, node:Object) => {
  if (node) {
    const newUrl = node.url
    if (node.expanded) {
      newUrl.pop()
    }
    const query = `${Object.keys(store.urlQuery).length > 0 ? `?${queryString.stringify(store.urlQuery)}` : ``}`
    const url = `/${newUrl.join(`/`)}${query}`
    store.history.push(url)
    node.expanded = !node.expanded
  }
}
