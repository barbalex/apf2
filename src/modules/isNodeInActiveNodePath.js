// @flow
import isEqual from 'lodash/isEqual'

export default (node:Object, activeUrl:Array<string>) => {
  if (!node) return false
  if (!node.url) return false
  if (!activeUrl) return false
  const activeUrlPartWithEqualLength = activeUrl.slice(0, node.url.length)
  return isEqual(activeUrlPartWithEqualLength, node.url)
}
