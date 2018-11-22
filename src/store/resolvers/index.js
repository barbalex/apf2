// @flow
import merge from 'lodash/merge'

import buildTreeKey from './treeKey'
import treeNodeLabelFilterKey from './treeNodeLabelFilterKey'
import treeNodeLabelFilter from './treeNodeLabelFilter'
import treeNodeLabelFilterResetExceptAp from './treeNodeLabelFilterResetExceptAp'
import treeMap from './treeMap'
import cloneTree2From1 from './cloneTree2From1'

export default ({ history, mobxStore }) => {
  const treeKey = buildTreeKey({ history, mobxStore })
  const resolvers = merge(
    treeKey,
    treeNodeLabelFilterKey,
    treeNodeLabelFilter,
    treeNodeLabelFilterResetExceptAp,
    treeMap,
    cloneTree2From1,
  )
  return resolvers
}
