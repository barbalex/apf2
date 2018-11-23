// @flow
import merge from 'lodash/merge'

import treeNodeLabelFilterKey from './treeNodeLabelFilterKey'
import treeNodeLabelFilter from './treeNodeLabelFilter'
import treeNodeLabelFilterResetExceptAp from './treeNodeLabelFilterResetExceptAp'

export default ({ mobxStore }) => {
  const resolvers = merge(
    treeNodeLabelFilterKey,
    treeNodeLabelFilter,
    treeNodeLabelFilterResetExceptAp,
  )
  return resolvers
}
