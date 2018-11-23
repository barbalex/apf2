// @flow
import merge from 'lodash/merge'

import treeNodeLabelFilterKey from './treeNodeLabelFilterKey'
import treeNodeLabelFilter from './treeNodeLabelFilter'
import treeNodeLabelFilterResetExceptAp from './treeNodeLabelFilterResetExceptAp'
import cloneTree2From1 from './cloneTree2From1'

export default ({ mobxStore }) => {
  const resolvers = merge(
    treeNodeLabelFilterKey,
    treeNodeLabelFilter,
    treeNodeLabelFilterResetExceptAp,
    cloneTree2From1,
  )
  return resolvers
}
