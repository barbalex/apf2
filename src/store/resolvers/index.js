// @flow
import merge from 'lodash/merge'

import treeNodeLabelFilterResetExceptAp from './treeNodeLabelFilterResetExceptAp'

export default ({ mobxStore }) => {
  const resolvers = merge(treeNodeLabelFilterResetExceptAp)
  return resolvers
}
