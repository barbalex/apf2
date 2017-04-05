// @flow
import isEqual from 'lodash/isEqual'

export default (node:Object, activeNodeArray:Array<string>) => {
  if (!node) return false
  if (!node.url) return false
  if (!activeNodeArray) return false
  return isEqual(activeNodeArray, node.url)
}
