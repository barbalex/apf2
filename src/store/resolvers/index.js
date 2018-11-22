// @flow
import merge from 'lodash/merge'

import buildTreeKey from './treeKey'
import treeNodeLabelFilterKey from './treeNodeLabelFilterKey'
import treeNodeLabelFilter from './treeNodeLabelFilter'
import treeNodeLabelFilterResetExceptAp from './treeNodeLabelFilterResetExceptAp'
import treeMap from './treeMap'
import buildUrlQuery from './urlQuery'
import cloneTree2From1 from './cloneTree2From1'

export default ({ history }) => {
  const treeKey = buildTreeKey({ history })
  const urlQuery = buildUrlQuery({ history })
  const resolvers = merge(
    treeKey,
    treeNodeLabelFilterKey,
    treeNodeLabelFilter,
    treeNodeLabelFilterResetExceptAp,
    treeMap,
    urlQuery,
    cloneTree2From1,
  )
  return resolvers
}
