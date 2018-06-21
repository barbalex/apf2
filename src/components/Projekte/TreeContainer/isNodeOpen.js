// @flow
import isEqual from 'lodash/isEqual'

export default (
  openNodes: Array<Array<String>>,
  url: Array<String>
): boolean => {
  if (!url) return false
  if (!openNodes) return false
  console.log('isNodeOpen:',{openNodes,url,isOpen:openNodes.some(n => isEqual(n, url))})
  return openNodes.some(n => isEqual(n, url))
}
