// @flow
import queryString from 'query-string'

export default (store:Object, node:Object) => {
  if (node) {
    const newUrl = node.url
    if (node.expanded) {
      newUrl.pop()
    }
    const url = `/${newUrl.join(`/`)}${Object.keys(store.urlQuery).length > 0 ? `?${queryString.stringify(store.urlQuery)}` : ``}`
    store.history.push(url)
    node.expanded = !node.expanded
  }
}
