// @flow
import merge from 'lodash/merge'

import treeNodeLabelFilterKey from './treeNodeLabelFilterKey'
import treeNodeLabelFilterResetExceptAp from './treeNodeLabelFilterResetExceptAp'

export default ({ mobxStore }) => {
  const resolvers = merge(
    treeNodeLabelFilterKey,
    treeNodeLabelFilterResetExceptAp,
  )
  return resolvers
}
